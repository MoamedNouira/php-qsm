#!/usr/bin/env python3
"""
سكريبت لإضافة الأسئلة إلى Supabase
"""

import json
from supabase import create_client, Client

# بيانات الاتصال
SUPABASE_URL = "https://lhhklbomjgljcvqsiqdy.supabase.co"
SUPABASE_KEY = "sb_publishable_C6c9KznLS9a2gzO7rcxskg_V9tUIjmB"

# إنشاء كلاينت Supabase
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# الأسئلة
questions = [
    {
        "category": "PHP",
        "question": "Quel est le résultat de ce code PHP?",
        "code_snippet": "$a = \"10\";\n$b = 10;\nvar_dump($a == $b);\nvar_dump($a === $b);",
        "options": [
            {"key": "a", "text": "true, false"},
            {"key": "b", "text": "false, true"},
            {"key": "c", "text": "true, true"},
            {"key": "d", "text": "false, false"},
        ],
        "correct_key": "a",
        "explanation": "En PHP, == vérifie l'égalité de valeur (10 == \"10\" est vrai), tandis que === vérifie l'égalité de type et de valeur. \"10\" (string) === 10 (int) est faux.",
    },
    {
        "category": "PHP",
        "question": "Quelle est la différence principale entre include() et require() en PHP?",
        "code_snippet": None,
        "options": [
            {"key": "a", "text": "Il n'y a aucune différence"},
            {"key": "b", "text": "require() génère une erreur fatale si le fichier n'existe pas, include() génère un avertissement"},
            {"key": "c", "text": "include() est plus rapide que require()"},
            {"key": "d", "text": "require() est utilisé pour les classes, include() pour les fonctions"},
        ],
        "correct_key": "b",
        "explanation": "La principale différence est la gestion des erreurs: require() arrête l'exécution du script avec une erreur fatale, tandis que include() continue avec un avertissement.",
    },
    {
        "category": "Architecture",
        "question": "Qu'est-ce que le pattern MVC?",
        "code_snippet": None,
        "options": [
            {"key": "a", "text": "Multi-View Component"},
            {"key": "b", "text": "Model-View-Controller"},
            {"key": "c", "text": "Module-Validation-Cache"},
            {"key": "d", "text": "Microservice-Virtualization-Cloud"},
        ],
        "correct_key": "b",
        "explanation": "MVC est un pattern architectural qui sépare une application en trois composants interconnectés: le Model (données), la View (présentation) et le Controller (logique).",
    },
    {
        "category": "Architecture",
        "question": "Quel principle SOLID traite de la segmentation en petits rôles?",
        "code_snippet": None,
        "options": [
            {"key": "a", "text": "Single Responsibility Principle"},
            {"key": "b", "text": "Open/Closed Principle"},
            {"key": "c", "text": "Liskov Substitution Principle"},
            {"key": "d", "text": "Interface Segregation Principle"},
        ],
        "correct_key": "a",
        "explanation": "Le SRP stipule qu'une classe devrait avoir une seule raison de changer, c'est-à-dire une seule responsabilité.",
    },
    {
        "category": "Base de Données",
        "question": "Quelle est la différence entre une JOIN INNER et LEFT?",
        "code_snippet": None,
        "options": [
            {"key": "a", "text": "Aucune différence en termes de résultats"},
            {"key": "b", "text": "INNER JOIN retourne seulement les lignes correspondantes, LEFT JOIN retourne aussi les non-correspondances de la table gauche"},
            {"key": "c", "text": "LEFT JOIN est plus rapide que INNER JOIN"},
            {"key": "d", "text": "INNER JOIN peut causer des doublons, pas LEFT JOIN"},
        ],
        "correct_key": "b",
        "explanation": "INNER JOIN retourne seulement les lignes où la condition de jointure est satisfaite. LEFT JOIN retourne toutes les lignes de la table gauche même s'il n'y a pas de correspondance à droite (avec NULL).",
    },
    {
        "category": "Base de Données",
        "question": "Qu'est-ce qu'une transaction en base de données?",
        "code_snippet": None,
        "options": [
            {"key": "a", "text": "Un ensemble de transactions SELECT"},
            {"key": "b", "text": "Un ensemble d'opérations SQL qui sont soit toutes exécutées, soit toutes annulées"},
            {"key": "c", "text": "Un backup automatique des données"},
            {"key": "d", "text": "Un index pour accélérer les requêtes"},
        ],
        "correct_key": "b",
        "explanation": "Une transaction garantit l'atomicité: soit toutes les opérations SQL sont validées (COMMIT), soit toutes sont annulées (ROLLBACK).",
    },
    {
        "category": "Sécurité",
        "question": "Comment éviter les injections SQL?",
        "code_snippet": None,
        "options": [
            {"key": "a", "text": "Utiliser implode() pour joindre les paramètres"},
            {"key": "b", "text": "Utiliser des prepared statements avec des paramètres liés"},
            {"key": "c", "text": "Convertir toutes les entrées en entiers"},
            {"key": "d", "text": "Utiliser addslashes() sur toutes les entrées"},
        ],
        "correct_key": "b",
        "explanation": "Les prepared statements séparent le code SQL des données, empêchant les attaques par injection SQL. addslashes() n'est pas suffisant car il peut être contourné.",
    },
    {
        "category": "Sécurité",
        "question": "Qu'est-ce que le CSRF (Cross-Site Request Forgery)?",
        "code_snippet": None,
        "options": [
            {"key": "a", "text": "Un virus qui infecte les fichiers du serveur"},
            {"key": "b", "text": "Une attaque où un utilisateur est forcé à effectuer des actions non autorisées sur un site où il est authentifié"},
            {"key": "c", "text": "Un problème de performance du serveur"},
            {"key": "d", "text": "Une erreur de syntaxe PHP"},
        ],
        "correct_key": "b",
        "explanation": "CSRF est une attaque web où un attaquant trompe un utilisateur authentifié pour qu'il effectue une action sur un site sans son consentement. On se protège avec des tokens CSRF.",
    },
    {
        "category": "Performance",
        "question": "Qu'est-ce que le caching et pourquoi est-ce important?",
        "code_snippet": None,
        "options": [
            {"key": "a", "text": "Un moyen de stocker les mots de passe en sécurité"},
            {"key": "b", "text": "Un processus de sauvegarde des données dans une mémoire rapide pour améliorer les performances"},
            {"key": "c", "text": "Un type de base de données"},
            {"key": "d", "text": "Une fonction PHP pour compresser les fichiers"},
        ],
        "correct_key": "b",
        "explanation": "Le caching stocke les données fréquemment accédées en mémoire rapide (Redis, Memcached) pour réduire les accès à la base de données et améliorer les performances.",
    },
    {
        "category": "Performance",
        "question": "Quel outil peut-on utiliser pour profiler les performances d'une application PHP?",
        "code_snippet": None,
        "options": [
            {"key": "a", "text": "PHPUnit"},
            {"key": "b", "text": "Xdebug"},
            {"key": "c", "text": "Composer"},
            {"key": "d", "text": "Docker"},
        ],
        "correct_key": "b",
        "explanation": "Xdebug est un debugger et profiler PHP qui permet d'analyser les performances, les appels de fonctions et l'utilisation de la mémoire.",
    },
    {
        "category": "OOP",
        "question": "Qu'est-ce que l'héritage en POO?",
        "code_snippet": None,
        "options": [
            {"key": "a", "text": "Un mécanisme où une classe hérite des propriétés et méthodes d'une autre classe"},
            {"key": "b", "text": "Un processus de copie de code entre fichiers"},
            {"key": "c", "text": "Un type de commentaire en PHP"},
            {"key": "d", "text": "Une fonction pour dupliquer des objets"},
        ],
        "correct_key": "a",
        "explanation": "L'héritage permet à une classe (enfant) d'hériter des propriétés et méthodes d'une autre classe (parent), favorisant la réutilisabilité du code.",
    },
    {
        "category": "OOP",
        "question": "Quelle est la différence entre une classe abstraite et une interface?",
        "code_snippet": None,
        "options": [
            {"key": "a", "text": "Il n'y a aucune différence"},
            {"key": "b", "text": "Une classe abstraite peut avoir des implémentations, une interface ne peut pas"},
            {"key": "c", "text": "Une interface peut avoir des propriétés, une classe abstraite non"},
            {"key": "d", "text": "Une classe abstraite est plus rapide qu'une interface"},
        ],
        "correct_key": "b",
        "explanation": "Une classe abstraite peut contenir des méthodes implémentées et des propriétés, tandis qu'une interface (en PHP 7+) ne peut contenir que la signature des méthodes (sauf les constantes).",
    },
]

def main():
    print("🚀 بدء إضافة الأسئلة إلى Supabase...")
    
    try:
        # حذف الأسئلة القديمة
        print("🗑️  حذف الأسئلة القديمة...")
        supabase.table("questions").delete().neq("id", None).execute()
        
        # إضافة الأسئلة الجديدة
        print(f"📝 إضافة {len(questions)} سؤال...")
        for i, question in enumerate(questions, 1):
            data = {
                "category": question["category"],
                "question": question["question"],
                "code_snippet": question["code_snippet"],
                "options": json.dumps(question["options"]),
                "correct_key": question["correct_key"],
                "explanation": question["explanation"],
            }
            supabase.table("questions").insert(data).execute()
            print(f"  ✅ تمت إضافة السؤال {i}/{len(questions)}")
        
        print("\n✅ تم إضافة جميع الأسئلة بنجاح!")
        print("🎉 يمكنك الآن فتح التطبيق على http://localhost:5173/")
        
    except Exception as e:
        print(f"❌ خطأ: {e}")

if __name__ == "__main__":
    main()
