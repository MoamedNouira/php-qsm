/*
# Create questions table (single-tenant, no auth)

1. New Tables
- `questions`
  - `id` (int, primary key)
  - `category` (text, not null) — e.g. "PHP / OO", "Symfony", "SQL & Bases de données"
  - `question` (text, not null) — French question text
  - `code_snippet` (text, nullable) — optional code block (PHP/SQL/HTML)
  - `options` (jsonb, not null) — array of { key, text } (A..E)
  - `correct_key` (text, not null) — the correct option key
  - `explanation` (text, not null) — technical explanation
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `questions`.
- Allow anon + authenticated SELECT only (read-only reference data). No inserts/updates/deletes from the client.
3. Index
- Index on `category` for filtering by subject.
*/

CREATE TABLE IF NOT EXISTS questions (
  id integer PRIMARY KEY,
  category text NOT NULL,
  question text NOT NULL,
  code_snippet text,
  options jsonb NOT NULL,
  correct_key text NOT NULL,
  explanation text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_questions" ON questions;
CREATE POLICY "anon_read_questions"
  ON questions FOR SELECT
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);

INSERT INTO questions (id, category, question, code_snippet, options, correct_key, explanation) VALUES
(1, 'PHP / OO',
 'En PHP 8.1+, quelle est la règle concernant les propriétés `readonly` ?',
 'class User {\n    public function __construct(\n        public readonly string $email\n    ) {}\n}',
 '[{"key":"A","text":"Une propriété readonly peut être réinitialisée dans une sous-classe."},{"key":"B","text":"Elle ne peut être écrite qu''une seule fois, depuis le scope de sa classe."},{"key":"C","text":"Elle peut être modifiée à l''intérieur de la méthode __clone()."},{"key":"D","text":"Il est possible d''attribuer une valeur par défaut à la déclaration."},{"key":"E","text":"Déclarer une classe en readonly permet des propriétés dynamiques."}]'::jsonb,
 'B',
 'En PHP 8.1+, une propriété readonly ne peut être initialisée qu''une seule fois et uniquement depuis le scope de la classe où elle est définie. Aucune valeur par défaut n''est autorisée à la déclaration, et toute réécriture (même dans __clone ou une sous-classe) lève une Error.'),
(2, 'PHP / OO',
 'Quel est le principal objectif de l''extension Fiber introduite en PHP 8.1 ?',
 'require ''vendor/autoload.php'';\n\n$fiber = new Fiber(function (): void {\n    $value = Fiber::suspend(''ping'');\n    echo $value;\n});\n\n$result = $fiber->start();\n$fiber->resume(''pong'');',
 '[{"key":"A","text":"Remplacer définitivement pthreads pour le vrai multithreading."},{"key":"B","text":"Permettre la concurrence coopérative et les coroutines en PHP pur."},{"key":"C","text":"Compiler du code PHP en bytecode natif pour accélérer l''exécution."},{"key":"D","text":"Garantir le ramasse-miette déterministe des objets cycliques."},{"key":"E","text":"Fournir un ORM asynchrone intégré au cœur de PHP."}]'::jsonb,
 'B',
 'Fiber fournit une pile d''exécution suspendable/résumable, permettant la concurrence coopérative (coroutines, tâches asynchrones) sans extensions natives. Ce n''est pas du vrai multithreading (pas de parallélisme) : les Fibers s''exécutent sur un seul thread mais peuvent suspendre leur exécution et la reprendre plus tard, ouvrant la voie à un code asynchrone lisible.'),
(3, 'PHP / OO',
 'Que garantit l''attribut `#[SensitiveParameter]` (PHP 8.2) sur un paramètre de fonction ?',
 'function authenticate(\n    string $user,\n    #[\\SensitiveParameter] string $password\n): void {\n    throw new \\LogicException(''Auth failed'');\n}',
 '[{"key":"A","text":"Le paramètre est chiffré automatiquement en mémoire par Zend."},{"key":"B","text":"Le paramètre est masqué dans les traces de pile et var_dump lors d''une exception."},{"key":"C","text":"Le paramètre ne peut plus être lu par le code de réflexion."},{"key":"D","text":"Le paramètre devient readonly et immuable dans la fonction."},{"key":"E","text":"Le paramètre est automatiquement hashé avec password_hash."}]'::jsonb,
 'B',
 'L''attribut #[SensitiveParameter] empêche que la valeur sensible apparaisse en clair dans les stack traces, les var_dump et les messages d''exception. Zend conserve la valeur normalement accessible au code métier, mais la filtre des sorties de débogage, évitant la fuite de mots de passe dans les logs.'),
(4, 'PHP / OO',
 'Quel mécanisme PHP 8.0 permet de structurer des métadonnées de classe/méthode sans dépendre de doc-comments ?',
 '/** @Route("/api/users", methods={"GET"}) */\n// devient :\n#[Route(path: ''/api/users'', methods: [''GET''])]\nfinal class UserController {\n    #[Route(path: ''/{id}'', methods: [''GET''])]\n    public function show(int $id): Response { /* ... */ }\n}',
 '[{"key":"A","text":"Les annotations Doctrine basées sur doc-blocks."},{"key":"B","text":"L''API ReflectionExtension native de PHP 7."},{"key":"C","text":"Les Attributs (Attributes) déclarés avec #[...]."},{"key":"D","text":"Le mot-clé enum introduit en PHP 8.1."},{"key":"E","text":"Les traits de configuration compile-time."}]'::jsonb,
 'C',
 'Les Attributs (#[...]) remplacent les doc-comments en tant que métadonnées structurées, typées et accessibles via l''API Reflection (ReflectionAttribute). Contrairement aux annotations en doc-blocks, ils sont validés par le moteur, supportent des arguments typés, et permettent aux frameworks (Symfony, Doctrine) de configurer le code de façon déclarative et fiable.'),
(5, 'PHP / OO',
 'Quelle est la différence clé entre une WeakMap et un tableau associatif standard ?',
 'class Cache {\n    private WeakMap $refs;\n\n    public function __construct() {\n        $this->refs = new WeakMap();\n    }\n\n    public function track(object $obj, mixed $meta): void {\n        $this->refs[$obj] = $meta;\n    }\n}',
 '[{"key":"A","text":"WeakMap autorise plusieurs valeurs pour une même clé."},{"key":"B","text":"WeakMap conserve ses entrées même après la destruction de la clé."},{"key":"C","text":"WeakMap autorise des clés scalaires en plus des objets."},{"key":"D","text":"Les clés WeakMap sont des références faibles : l''entrée est supprimée quand l''objet est détruit."},{"key":"E","text":"WeakMap est partagée entre tous les processus PHP."}]'::jsonb,
 'D',
 'Une WeakMap utilise des références faibles sur ses clés (qui doivent être des objets). Quand l''objet clé n''est plus référencé ailleurs et est collecté par le GC, l''entrée correspondante est automatiquement supprimée de la map. Cela évite les fuites de mémoire lors de l''association de métadonnées à des objets (cache, registre d''observateurs).'),
(6, 'Symfony',
 'Dans Symfony, quel est le rôle d''un CompilerPass ?',
 'class ServiceLocatorPass implements CompilerPassInterface {\n    public function process(ContainerBuilder $container): void\n    {\n        foreach ($container->findTaggedServiceIds(''app.locator'') as $id => $tags) {\n            // ... manipule la définition\n        }\n    }\n}',
 '[{"key":"A","text":"Exécuter du code asynchrone via Messenger à la compilation."},{"key":"B","text":"Modifier la définition du container DI avant qu''il ne soit figé (compilé)."},{"key":"C","text":"Gérer la persistance des entités Doctrine pendant le warmup."},{"key":"D","text":"Déclencher des migrations de base de données au démarrage."},{"key":"E","text":"Valider les contraintes de formulaire à la compilation."}]'::jsonb,
 'B',
 'Un CompilerPass s''exécute pendant la compilation du container de dépendances, avant que celui-ci ne soit figé (dumpé). Il permet de manipuler les définitions de services (ajouter des appels de méthode, enregistrer des taggés dans un registry, résoudre des alias conditionnels). C''est le mécanisme central qui rend l''autoconfiguration et les conventions de Symfony possibles.'),
(7, 'Symfony',
 'Quel composant Symfony est conçu pour modéliser et valider le cycle de vie d''un objet métier (états et transitions) ?',
 'use Symfony\\Component\\Workflow\\Workflow;\n\n$workflow = $factory->get($subject);\nif ($workflow->can($subject, ''publish'')) {\n    $workflow->apply($subject, ''publish'');\n}',
 '[{"key":"A","text":"Le composant Workflow."},{"key":"B","text":"Le composant Process."},{"key":"C","text":"Le composant Serializer."},{"key":"D","text":"Le composant Form."},{"key":"E","text":"Le composateOptionsResolver."}]'::jsonb,
 'A',
 'Le composant Workflow modélise des machines à états finis (state machines) et des processus (workflows). Il définit des places (états) et des transitions gardées, et fournit can()/apply() pour vérifier et appliquer les changements d''état. Il émet des événements (GuardEvent, TransitionEvent) et centralise la logique métier de cycle de vie (document, commande, etc.).'),
(8, 'Symfony',
 'Dans Symfony Messenger, quelle est la différence entre un `sync` transport et un transport `doctrine` ?',
 '// config: FRAMEWORK.MESSENGER\ntransports:\n    sync:\n        dsn: ''sync://''\n    async:\n        dsn: ''doctrine://default?queue_name=high''\n\n// dispatch\n$bus->dispatch(new SendWelcomeEmail($userId));',
 '[{"key":"A","text":"Aucune : les deux stockent les messages en base de données."},{"key":"B","text":"`sync` exécute le handler immédiatement dans le process courant ; `doctrine` persiste le message pour un worker asynchrone."},{"key":"C","text":"`sync` persiste en Redis ; `doctrine` persiste en base."},{"key":"D","text":"`sync` est toujours plus rapide pour les tâches longues."},{"key":"E","text":"`doctrine` ne supporte pas les retries."}]'::jsonb,
 'B',
 'Le transport `sync://` exécute le handler immédiatement dans le même processus que le dispatch (utile en dev ou pour des tâches critiques). Le transport `doctrine://` persiste le message dans une table en base de données, permettant à un worker (messenger:consume) de le traiter ultérieurement de façon asynchrone, avec retries, retardement et isolation des pannes.'),
(9, 'SQL & Bases de données',
 'Quel niveau d''isolation de transaction PostgreSQL évite les lectures non reproductibles SANS poser de verrous exclusifs sur toutes les lectures ?',
 'BEGIN ISOLATION LEVEL REPEATABLE READ;\n\nSELECT balance FROM accounts WHERE id = 1;\n-- ... autre lecture plus tard ...\nSELECT balance FROM accounts WHERE id = 1;\n\nCOMMIT;',
 '[{"key":"A","text":"Read Uncommitted."},{"key":"B","text":"Read Committed (défaut PostgreSQL)."},{"key":"C","text":"Repeatable Read (snapshot MVCC)."},{"key":"D","text":"Serializable (verrous prédicats SSI)."},{"key":"E","text":"Aucun niveau ne peut éviter ce phénomène."}]'::jsonb,
 'C',
 'En PostgreSQL, Repeatable Read utilise le MVCC : la transaction voit un snapshot cohérent pris à sa première lecture, évitant les lectures non reproductibles sans poser de verrou exclusif sur les lignes lues. Les écritures concurrentes sont gérées par le contrôleur de concurrence au moment du COMMIT (le premier commit gagne). Serializable va plus loin avec SSI (Serializable Snapshot Isolation) pour éviter aussi les anomalies de sérialisation.'),
(10, 'SQL & Bases de données',
 'Quel type d''index PostgreSQL est le plus adapté pour accélérer la recherche en texte intégral (FULL TEXT SEARCH) ?',
 'CREATE INDEX idx_docs_search ON docs\n    USING GIN (to_tsvector(''french'', body));\n\nSELECT id FROM docs\nWHERE to_tsvector(''french'', body) @@ to_tsquery(''french'', ''symfony & performance'');',
 '[{"key":"A","text":"Un index B-Tree classique sur la colonne."},{"key":"B","text":"Un index GIN sur le tsvector."},{"key":"C","text":"Un index BRIN trié par date."},{"key":"D","text":"Un index Hash."},{"key":"E","text":"Un index partiel UNIQUE."}]'::jsonb,
 'B',
 'Un index GIN (Generalized Inverted Index) est conçu pour les données composées de plusieurs éléments (tsvector, jsonb, tableaux). Pour la recherche en texte intégral, il indexe les lexèmes et permet de répondre rapidement aux requêtes @@ avec to_tsquery. Le B-Tree n''est pas adapté aux opérateurs de recherche plein texte. BRIN est utile pour de grandes tables ordonnées physiquement (ex. par date).'),
(11, 'SQL & Bases de données',
 'Pourquoi un index sur une colonne de très faible cardinalité (ex. un booléen) est-il généralement inefficace avec un B-Tree ?',
 'EXPLAIN SELECT * FROM orders WHERE is_paid = true;\n-- Seq Scan au lieu d''Index Scan',
 '[{"key":"A","text":"Parce que les B-Tree ne supportent pas les booléens."},{"key":"B","text":"Parce que le sélecteur de plan estime qu''un balayage séquentiel coûte moins cher que de remonter un grand nombre de lignes."},{"key":"C","text":"Parce qu''un index ne peut pas être créé sur un booléen."},{"key":"D","text":"Parce que les booléens sont stockés en base 64."},{"key":"E","text":"Parce qu''il faut obligatoirement un index Hash pour les booléens."}]'::jsonb,
 'B',
 'Avec une faible cardinalité (ex. 50% de vrais), le planner de PostgreSQL estime que l''Index Scan remonterait une large fraction des lignes et qu''un Seq Scan (avec lecture séquentielle et utilisant le shared buffers) est moins coûteux. Un index partiel (WHERE is_paid = true) ou combiné (is_paid, created_at) est bien plus utile dans ce cas.'),
(12, 'SQL & Bases de données',
 'Comment PostgreSQL détecte-t-il et gère-t-il un interblocage (DEADLOCK) entre deux transactions ?',
 '-- T1\nBEGIN;\nUPDATE accounts SET balance = balance - 10 WHERE id = 1; -- verrou sur id=1\nUPDATE accounts SET balance = balance + 10 WHERE id = 2; -- attend T2\n\n-- T2\nBEGIN;\nUPDATE accounts SET balance = balance - 50 WHERE id = 2; -- verrou sur id=2\nUPDATE accounts SET balance = balance + 50 WHERE id = 1; -- attend T1 -> DEADLOCK',
 '[{"key":"A","text":"Il ne les détecte jamais : les transactions restent bloquées indéfiniment."},{"key":"B","text":"Un processus dédié (deadlock detector) interrompt l''une des transactions avec l''erreur SQLSTATE 40P01."},{"key":"C","text":"Les deux transactions sont automatiquement validées."},{"key":"D","text":"PostgreSQL sélectionne aléatoirement la transaction la plus ancienne."},{"key":"E","text":"Le deadlock n''est détecté qu''au moment du COMMIT."}]'::jsonb,
 'B',
 'PostgreSQL dispose d''un deadlock detector qui s''exécute périodiquement (par défaut à chaque cycle de timeout lock). En détectant un cycle d''attente dans le graphe des verrous, il interrompt une des transactions impliquées avec l''erreur SQLSTATE 40P01 (deadlock_detected). L''application doit alors intercepter cette erreur et réessayer la transaction (retry pattern).'),
(13, 'HTML5 & Web APIs',
 'Quelle stratégie protège efficacement contre le XSS basé sur du contenu utilisateur inséré dans le DOM ?',
 '<div id="out"></div>\n<script>\n  const user = new URLSearchParams(location.search).get(''name'');\n  // Quelle approche est sûre ?\n</script>',
 '[{"key":"A","text":"Insérer via innerHTML en échappant manuellement avec un regex."},{"key":"B","text":"Utiliser textContent (ou un framework qui échappe automatiquement) au lieu d''innerHTML."},{"key":"C","text":"Stocker la valeur dans un attribut data- sans échappement."},{"key":"D","text":"Afficher le contenu dans un <iframe sandbox> non restrictive."},{"key":"E","text":"Compter uniquement sur une politique CSP ''unsafe-inline''."}]'::jsonb,
 'B',
 'textContent (et les frameworks modernes qui échappent par défaut comme React) insère le contenu en tant que texte et non en tant que HTML, neutralisant les injections de balises/scripts. innerHTML avec un regex est fragile (contournes fréquents). Une CSP stricte (sans unsafe-inline) est un filet de sécurité complémentaire mais ne remplace pas l''échappement systématique à la sortie.'),
(14, 'HTML5 & Web APIs',
 'Quelle différence majeure entre WebSockets et Server-Sent Events (SSE) ?',
 '// SSE\nconst es = new EventSource(''/stream'');\nes.onmessage = (e) => console.log(e.data);\n\n// WebSocket\nconst ws = new WebSocket(''wss://app/socket'');\nws.onmessage = (e) => console.log(e.data);',
 '[{"key":"A","text":"SSE supporte la communication bidirectionnelle full-duplex ; WebSocket est unidirectionnel serveur->client."},{"key":"B","text":"WebSocket est bidirectionnel full-duplex ; SSE est unidirectionnel serveur->client sur HTTP."},{"key":"C","text":"Les deux sont strictement équivalents."},{"key":"D","text":"SSE nécessite un protocole binaire propriétaire."},{"key":"E","text":"WebSocket ne fonctionne que sur HTTPS."}]'::jsonb,
 'B',
 'WebSocket établit une connexion TCP bidirectionnelle full-duplex (protocole ws/wss) idéale pour les chats et jeux temps réel. SSE fonctionne au-dessus de HTTP et diffuse uniquement du serveur vers le client (unidirectionnel), avec reconnexion automatique et Last-Event-ID. SSE est plus simple pour des flux de notifications/telemétrie ; WebSocket est préférable pour des échanges bidirectionnels.'),
(15, 'HTML5 & Web APIs',
 'Comment le CORS protège-t-il une API tout en autorisant les appels légitimes depuis un navigateur ?',
 'OPTIONS /api/data HTTP/1.1\nOrigin: https://app.example.com\nAccess-Control-Request-Method: POST\nAccess-Control-Request-Headers: Authorization\n\nHTTP/1.1 200\nAccess-Control-Allow-Origin: https://app.example.com\nAccess-Control-Allow-Methods: GET, POST\nAccess-Control-Allow-Headers: Authorization',
 '[{"key":"A","text":"Il chiffre le trafic entre le navigateur et le serveur d''API."},{"key":"B","text":"Il autorise le serveur à déclarer explicitement quelles origines peuvent lire ses réponses cross-origin."},{"key":"C","text":"Il remplace l''authentification par jeton JWT."},{"key":"D","text":"Il empêche tout appel depuis un autre domaine, sans exception."},{"key":"E","text":"Il n''est pertinent que pour les requêtes simples GET."}]'::jsonb,
 'B',
 'CORS (Cross-Origin Resource Sharing) est un mécanisme du navigateur : pour les requêtes cross-origin, le serveur doit renvoyer explicitement Access-Control-Allow-Origin (et pour les requêtes non simples, valider un preflight OPTIONS) autorisant l''origine. Sans cela, le navigateur bloque la lecture de la réponse au script. CORS ne remplace pas l''authentification : c''est une politique de confiance côté client pour relâcher la Same-Origin Policy.'),
(16, 'Testing & Qualité',
 'Quel est l''objectif principal d''une analyse statique de niveau 8 (PHPStan) dans un projet PHP ?',
 '# phpstan.neon\nparameters:\n    level: 8\n    paths:\n        - src/\n    checkGenericClassInProperty: true\n    checkMissingCallableSignature: true',
 '[{"key":"A","text":"Exécuter les tests unitaires plus rapidement en parallèle."},{"key":"B","text":"Détecter les bugs de type et de logique sans exécuter le code (vérification statique stricte des types)."},{"key":"C","text":"Générer automatiquement des fixtures de base de données."},{"key":"D","text":"Mesurer la couverture de code en production."},{"key":"E","text":"Remplacer PHPUnit pour les tests d''intégration."}]'::jsonb,
 'B',
 'PHPStan niveau 8 effectue une analyse statique très stricte : il vérifie les types, la nullabilité, les retours, les closures, les generics et les signatures sans exécuter le code. Cela détecte des classes entières de bugs avant l''exécution (types incohérents, appels à des méthodes inexistantes, conditions toujours vraies/fausses). Combiné à PHPUnit, il élève fortement la fiabilité du code mais ne remplace pas les tests dynamiques.'),
(17, 'Testing & Qualité',
 'Quelle est la différence essentielle entre un mock et un stub dans les tests PHPUnit ?',
 '$repo = $this->createStub(UserRepository::class);\n$repo->method(''find'')->willReturn($user);\n\n$notifier = $this->createMock(Notifier::class);\n$notifier->expects($this->once())\n    ->method(''send'')\n    ->with($user);',
 '[{"key":"A","text":"Aucune : les deux termes sont interchangeables."},{"key":"B","text":"Un stub fournit des réponses contrôlées ; un mock vérifie aussi que des attentes (interactions) sont respectées."},{"key":"C","text":"Un mock ne renvoie jamais de valeur ; un stub toujours."},{"key":"D","text":"Un stub fonctionne seulement avec des méthodes privées."},{"key":"E","text":"Un mock remplace des classes finales ; un stub non."}]'::jsonb,
 'B',
 'Un stub (createStub) remplace un collaborateur pour renvoyer des valeurs contrôlées (état) ; on l''interroge sur l''état qu''il a fourni. Un mock (createMock) enregistre en plus les attentes d''interaction (combien de fois, avec quels arguments) et fait échouer le test si elles ne sont pas respectées (comportement). On utilise des stubs pour tester l''état retourné et des mocks pour vérifier les collaborations (ex. vérifier qu''un mail a bien été envoyé une fois).'),
(18, 'Software Architecture',
 'Dans une architecture microservices, quel est le rôle d''un API Gateway par rapport à une communication client-service directe ?',
 'Client -> API Gateway -> [Auth, Orders, Billing, Shipping]\n\nGateway: routing, authn, rate-limiting, aggregation, TLS',
 '[{"key":"A","text":"Stocker toute la logique métier au même endroit qu''un monolithe."},{"key":"B","text":"Servir de point d''entrée unique : routage, authentification, rate-limiting, agrégation et offloading TLS."},{"key":"C","text":"Remplacer complètement le broker de messages Kafka/RabbitMQ."},{"key":"D","text":"Supprimer la nécessité de load balancers dans le cluster."},{"key":"E","text":"Gérer la persistance des données de chaque service."}]'::jsonb,
 'B',
 'Un API Gateway centralise les préoccupations transverses (cross-cutting) : authentification, autorisation, routage vers les services, rate-limiting, agrégation de plusieurs services, transformation de protocoles et terminaison TLS. Cela évite aux clients de connaître chaque service et mutualise les politiques. Il ne doit pas devenir une god class métier : la logique reste dans les services, le gateway orchestre seulement.'),
(19, 'Software Architecture',
 'Quel pattern de communication est privilégié dans une architecture Event-Driven pour découpler producteurs et consommateurs de façon asynchrone ?',
 'Producer -> [ Topic ] -> Consumer(s)\n\n// Symfony Messenger + Kafka/RabbitMQ\n$bus->dispatch(new OrderPlacedEvent($orderId));\n// plusieurs handlers réagissent indépendamment',
 '[{"key":"A","text":"L''appel RPC synchrone direct entre services."},{"key":"B","text":"La publication d''événements sur un broker de messages consommés de façon asynchrone."},{"key":"C","text":"Le polling régulier d''une base de données partagée."},{"key":"D","text":"Le partage d''une table SQL entre services."},{"key":"E","text":"Les appels HTTP synchrones avec retry infini."}]'::jsonb,
 'B',
 'Dans une architecture event-driven, les producteurs publient des événements (ex. OrderPlaced) sur un broker (Kafka, RabbitMQ) et les consommateurs les traitent de façon asynchrone et indépendante. Cela découple temporellement et fonctionnellement les services, améliore la résilience (un service en panne ne bloque pas le producteur) et permet d''ajouter de nouveaux consommateurs sans modifier le producteur. Le RPC synchrone, au contraire, couple fortement les services et réduit la résilience.'),
(20, 'Software Architecture',
 'En Domain-Driven Design (DDD), qu''est-ce qu''un Aggregate Root et quelle règle obéit-il ?',
 'final class Order {\n    private OrderId $id;\n    /** @var OrderLine[] */\n    private array $lines;\n\n    public function addLine(ProductId $p, int $qty): void { /* ... */ }\n    public function total(): Money { /* ... */ }\n}',
 '[{"key":"A","text":"Une classe de persistance technique (repository) qui charge les entités."},{"key":"B","text":"L''unique point d''entrée d''un agrégat : toute modification passe par lui, garantissant les invariants du domaine."},{"key":"C","text":"Un service applicatif qui orchestre plusieurs cas d''usage."},{"key":"D","text":"Une table de jointure entre deux entités."},{"key":"E","text":"Un Value Object immuable représentant un identifiant."}]'::jsonb,
 'B',
 'L''Aggregate Root est l''entité racine d''un agrégat (cluster d''objets de domaine cohérents). C''est le seul point d''entrée : les références externes pointent vers la racine, et toute modification des objets internes passe par ses méthodes. Cela garantit que les invariants du domaine sont préservés à chaque opération et facilite la cohérence transactionnelle (une transaction = un agrégat). Les repositories travaillent uniquement sur des racines d''agrégat.')
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  question = EXCLUDED.question,
  code_snippet = EXCLUDED.code_snippet,
  options = EXCLUDED.options,
  correct_key = EXCLUDED.correct_key,
  explanation = EXCLUDED.explanation;
