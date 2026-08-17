import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lhhklbomjgljcvqsiqdy.supabase.co';
const SUPABASE_KEY = 'sb_publishable_C6c9KznLS9a2gzO7rcxskg_V9tUIjmB';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);


const questions = [
    {
        category: 'PHP',
        question: 'Quel est le résultat correct de l\'instruction suivante ?',
        code_snippet: '$arr = [1, 2, 3];\n$arr[] = 4;\nprint_r($arr);',
        options: [
            { key: 'a', text: 'Génère une erreur (Error)' },
            { key: 'b', text: 'Ajoute l\'élément 4 au début du tableau' },
            { key: 'c', text: 'Ajoute l\'élément 4 à la fin du tableau' },
            { key: 'd', text: 'Supprime le tableau' },
        ],
        correct_key: 'c',
        explanation: 'En PHP, l\'utilisation de crochets vides [] avec un tableau permet d\'ajouter automatiquement un nouvel élément à la fin du tableau.',
    },
    {
        category: 'Web',
        question: 'Quel est l\'objectif principal de l\'utilisation du code d\'état HTTP 403 ?',
        code_snippet: null,
        options: [
            { key: 'a', text: 'La ressource est introuvable (Not Found)' },
            { key: 'b', text: 'La requête est refusée car l\'utilisateur n\'a pas les permissions nécessaires (Forbidden)' },
            { key: 'c', text: 'Erreur interne du serveur (Internal Server Error)' },
            { key: 'd', text: 'L\'utilisateur n\'est pas connecté (Unauthorized)' },
        ],
        correct_key: 'b',
        explanation: 'Le code 403 signifie que le serveur a compris la requête mais refuse de l\'exécuter en raison d\'un manque de permissions, tandis que 401 indique qu\'une authentification est requise.',
    },
    {
        category: 'DevOps',
        question: 'Quelle est la fonction principale de Docker ?',
        code_snippet: null,
        options: [
            { key: 'a', text: 'Concevoir des interfaces utilisateur' },
            { key: 'b', text: 'Gérer uniquement les bases de données' },
            { key: 'c', text: 'Empaqueter des applications et les exécuter dans des environnements isolés (Conteneurs)' },
            { key: 'd', text: 'Développer de nouveaux langages de programmation' },
        ],
        correct_key: 'c',
        explanation: 'Docker permet aux développeurs d\'empaqueter leurs applications avec toutes leurs dépendances dans des "conteneurs" afin de garantir un fonctionnement identique sur n\'importe quelle machine.',
    },
    {
        category: 'PHP',
        question: 'Quel est l\'intérêt du Type Hinting en PHP ?',
        code_snippet: 'function sum(int $a, int $b) {\n  return $a + $b;\n}',
        options: [
            { key: 'a', text: 'Augmenter la vitesse d\'exécution du code' },
            { key: 'b', text: 'Réduire la taille du fichier' },
            { key: 'c', text: 'Imposer le type des données passées en paramètre et éviter les erreurs' },
            { key: 'd', text: 'Faire fonctionner le code uniquement sur PHP 5' },
        ],
        correct_key: 'c',
        explanation: 'Le Type Hinting aide à écrire un code plus sûr et plus lisible en s\'assurant que les variables fournies correspondent au type attendu (par exemple int ou string).',
    },
    {
        category: 'Sécurité',
        question: 'Qu\'est-ce que le XSS (Cross-Site Scripting) ?',
        code_snippet: null,
        options: [
            { key: 'a', text: 'L\'injection de code JavaScript malveillant dans une page web exécutée par d\'autres utilisateurs' },
            { key: 'b', text: 'L\'envoi d\'un grand nombre de requêtes pour surcharger le serveur' },
            { key: 'c', text: 'Le devinement du mot de passe d\'un utilisateur' },
            { key: 'd', text: 'Le vol de fichiers de la base de données' },
        ],
        correct_key: 'a',
        explanation: 'Une attaque XSS se produit lorsqu\'un attaquant parvient à injecter des scripts malveillants dans une page web consultée par d\'autres utilisateurs, ce qui lui permet de voler des cookies ou de manipuler le contenu.',
    }
];

async function main() {
    console.log('🚀 Commencez à ajouter des questions à Supabase...\n');

    try {
        // حذف الأسئلة القديمة
        /*console.log('🗑️  Supprimer les anciennes questions...');
        const { data: existingData, error: deleteError } = await supabase
            .from('questions')
            .select('id')
            .limit(1);

        if (existingData && existingData.length > 0) {
            await supabase.from('questions').delete().neq('id', -1);
        }*/

        // إضافة الأسئلة الجديدة
        console.log(`📝 ajout ${questions.length} سؤال...\n`);

        for (let i = 0; i < questions.length; i++) {
            const question = questions[i];
            const { error } = await supabase.from('questions').insert([
                {
                    category: question.category,
                    question: question.question,
                    code_snippet: question.code_snippet,
                    options: question.options,
                    correct_key: question.correct_key,
                    explanation: question.explanation,
                },
            ]);

            if (error) {
                console.error(`❌ La question est incorrecte. ${i + 1}:`, error.message);
            } else {
                console.log(`  ✅ La question a été ajoutée.${i + 1}/${questions.length}`);
            }
        }

        console.log('\n✅ Toutes les questions ont été ajoutées avec succès ! ');
        console.log('🎉  Vous pouvez maintenant ouvrir l application sur http://localhost:5173/\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ erreur:', error.message);
        process.exit(1);
    }
}

main();