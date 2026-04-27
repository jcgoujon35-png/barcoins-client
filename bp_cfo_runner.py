#!/usr/bin/env python3
import subprocess, os, time, urllib.request, urllib.parse

BOT_TOKEN = '7829640887:AAFXNYM3mIq7vJcwBL_d-ocHEysVfC3RPSA'
CHAT_ID = '8017110523'
OPENCLAW = '/home/jean-christophe/.npm-global/bin/openclaw'
OUTPUT_DIR = '/mnt/c/Users/jean-/OneDrive/Documents/Barcoins/07_EXPORTS/'
OUTPUT_FILE = OUTPUT_DIR + 'impact-economique-systeme-hybride-bcoins-play-avril-2026.md'

os.makedirs(OUTPUT_DIR, exist_ok=True)

def telegram(msg):
    url = 'https://api.telegram.org/bot' + BOT_TOKEN + '/sendMessage'
    data = urllib.parse.urlencode({'chat_id': CHAT_ID, 'text': msg}).encode()
    try:
        urllib.request.urlopen(url, data, timeout=10)
    except Exception as e:
        print('tg err:', e)

def run_cfo(prompt):
    result = subprocess.run(
        [OPENCLAW, 'agent', '--agent', 'cfo', '--message', prompt, '--timeout', '560'],
        capture_output=True, text=True, timeout=580
    )
    return result.stdout.strip()

def append_section(title, content):
    with open(OUTPUT_FILE, 'a', encoding='utf-8') as f:
        f.write('\n\n---\n\n')
        f.write(content)
    print('OK - ' + title + ' - ' + str(len(content)) + ' chars')

# Init fichier
with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write('# IMPACT ECONOMIQUE - SYSTEME HYBRIDE BCOINS PLAY\n')
    f.write('## Analyse financiere BarCoins - Avril 2026\n')
    f.write('*Document genere par agent CFO - 6 sessions sequentielles*\n\n')

telegram('[DEBUT] Agent CFO demarre le business plan - 6 sections. Notification apres chaque section. Duree estimee : 40-60min.')

sections = [
    {
        'title': 'Section A - Executive Summary',
        'prompt': (
            'MISSION IMMEDIATE : Redige maintenant la section A - Executive Summary du business plan BarCoins.\n\n'
            'CONTEXTE :\n'
            '- SaaS B2B gamification bars/cafes, Occitanie, solo founder JC\n'
            '- Systeme hybride Bcoins : Comptoir des Avantages (beta) + Passeport de Saison (oct 2026) + Forgeur de Statut (oct 2026)\n'
            '- 3 compteurs wallet : playCoins / playCoinsTotal (JAMAIS diminue) / fideliteCoins\n'
            '- Plans : STARTER 89EUR / STANDARD 149EUR / PREMIUM 249EUR\n'
            '- Beta juillet 2026 / Commercial octobre 2026\n\n'
            'LIVRABLE : Ecris directement le texte complet (pas de meta-commentaire) :\n'
            '- Executive summary 200 mots\n'
            '- Enjeux du systeme hybride\n'
            '- Hypotheses cles explicites\n'
            '- Verdict GO/NO-GO chiffre\n\n'
            'Format markdown. Commence directement par le contenu.'
        )
    },
    {
        'title': 'Section B - Benchmarks prix terrain',
        'prompt': (
            'MISSION IMMEDIATE : Redige maintenant la section B - Benchmarks prix bar locaux.\n\n'
            'LIVRABLE : Ecris directement (pas de meta-commentaire) :\n'
            '- Tableau prix Perpignan / Narbonne / Montpellier : Shot / Biere / Biere qualite / Cocktail / Planche apero\n'
            '- Tag [Donnee sourcee] ou [Hypothese] pour chaque prix\n'
            '- Marge brute estimee bar par produit\n'
            '- Formule coins : playCoins = floor(montant x multiplicateur). Paliers : moins de 10EUR x1, 10-19EUR x1.5, 20-29EUR x2, 30-49EUR x3, 50EUR+ x4\n'
            '- Analyse : les seuils Comptoir (Shot=35 coins / Biere=80 / Cocktail=160 / Planche=200) sont-ils coherents avec les prix locaux ?\n\n'
            'Format markdown tableaux. Commence directement par le contenu.'
        )
    },
    {
        'title': 'Section C - Modele unitaire Bcoins',
        'prompt': (
            'MISSION IMMEDIATE : Redige maintenant la section C - Modele unitaire et calculs Bcoins.\n\n'
            'LIVRABLE : Ecris directement :\n'
            '- Tableau note typique 10EUR / 20EUR / 35EUR / 50EUR => coins octroyes\n'
            '- Visites necessaires pour atteindre chaque rang : Captain Americano 30 / Ant-Rhum 200 / Lo-Kir 600 / Spider-Malt 1500 / Thorquila 3500 coins cumules\n'
            '- Cout reel par redemption Comptoir : Shot 35 coins = X EUR offert selon prix moyen local\n'
            '- Ratio valeur percue joueur vs cout reel bar\n'
            '- Dette promotionnelle : 100 joueurs actifs => coins emis par mois + cout max redemption\n'
            '- Verdict GO/NO-GO chiffre sur viabilite economique pour le bar\n\n'
            'Format markdown tableaux. Commence directement.'
        )
    },
    {
        'title': 'Section D - Ratios et scenarios financiers',
        'prompt': (
            'MISSION IMMEDIATE : Redige maintenant la section D - Scenarios financiers BarCoins SaaS.\n\n'
            'LIVRABLE : Ecris directement 3 scenarios (Prudent / Central / Ambitieux) sur M1/M6/M12/M24 post-oct 2026 :\n'
            '- Bars actifs\n'
            '- MRR (mix STARTER 60% + STANDARD 30% + PREMIUM 10%)\n'
            '- ARR\n'
            '- Churn mensuel (CHR 25-30%/an)\n'
            '- CAC estime et LTV calcule\n'
            '- Ratio LTV/CAC\n'
            '- Mois avant rentabilite\n\n'
            'Hypotheses explicites. Sources CHR si dispo. Verdict GO/NO-GO viabilite SaaS.\n'
            'Format markdown tableaux. Commence directement.'
        )
    },
    {
        'title': 'Section E - Risques et dette promotionnelle',
        'prompt': (
            'MISSION IMMEDIATE : Redige maintenant la section E - Risques financiers BarCoins.\n\n'
            'LIVRABLE : Ecris directement :\n'
            '- Tableau top 5 risques : probabilite / impact EUR / mitigation\n'
            '- Dette promotionnelle : 1000 joueurs accumulent des playCoinsTotal => passif theorique max, comment le plafonner\n'
            '- Risque concentration 5 bars pilotes = X% MRR\n'
            '- Risque ANJ : worst case financier si validation impossible\n'
            '- Risque churn gerant CHR : cout re-acquisition\n'
            '- Plan mitigation concret\n\n'
            'Format markdown. Commence directement.'
        )
    },
    {
        'title': 'Section F - Valorisation et recommandations',
        'prompt': (
            'MISSION IMMEDIATE : Redige maintenant la section F - Valorisation et conclusion investisseur BarCoins.\n\n'
            'LIVRABLE : Ecris directement :\n'
            '- Valorisation pre-money 3 methodes : multiple ARR (x5-x8 SaaS) + DCF simplifie + benchmark startups CHR\n'
            '- Besoin financement : phase 1 (12-15k EUR beta) et phase 2 (seed 300-500k EUR)\n'
            '- Utilisation des fonds en pourcentage\n'
            '- Dilution proposee 10-15%, valorisation pre-money cible\n'
            '- Scoring GO/NO-GO investissement : marche / execution / timing\n'
            '- 3 KPIs critiques avant seed\n'
            '- Next steps concrets pour JC cette semaine\n\n'
            'Format markdown. Conclusion tranchee. Commence directement.'
        )
    }
]

for i, section in enumerate(sections):
    print('\n[' + str(i+1) + '/6] ' + section['title'])
    telegram('[AVANCEMENT ' + str(i+1) + '/6] CFO - ' + section['title'] + ' en cours...')
    try:
        result = run_cfo(section['prompt'])
        if result and len(result) > 100:
            content = '## ' + section['title'] + '\n\n' + result
            append_section(section['title'], content)
            telegram('[OK ' + str(i+1) + '/6] ' + section['title'] + ' OK (' + str(len(result)) + ' chars)')
        else:
            content = '## ' + section['title'] + '\n\n[REPONSE INCOMPLETE]\n' + result
            append_section(section['title'], content)
            telegram('[ALERTE ' + str(i+1) + '/6] ' + section['title'] + ' - incomplete, continuation')
    except subprocess.TimeoutExpired:
        append_section(section['title'], '## ' + section['title'] + '\n\n[TIMEOUT 580s]')
        telegram('[TIMEOUT ' + str(i+1) + '/6] ' + section['title'])
    except Exception as e:
        append_section(section['title'], '## ' + section['title'] + '\n\n[ERREUR : ' + str(e) + ']')
        telegram('[ERREUR ' + str(i+1) + '/6] ' + str(e)[:80])
    if i < 5:
        time.sleep(5)

file_size = os.path.getsize(OUTPUT_FILE) if os.path.exists(OUTPUT_FILE) else 0
telegram(
    '[LIVRABLE FINAL] Business Plan BarCoins termine.\n\n'
    'Fichier : OneDrive/Barcoins/07_EXPORTS/\n'
    'impact-economique-systeme-hybride-bcoins-play-avril-2026.md\n'
    'Taille : ' + str(file_size // 1024) + ' KB\n\n'
    'A - Executive Summary\nB - Benchmarks prix terrain\n'
    'C - Modele unitaire Bcoins\nD - Ratios et scenarios\n'
    'E - Risques et dette promo\nF - Valorisation et conclusion'
)
print('[DONE] ' + OUTPUT_FILE + ' (' + str(file_size) + ' bytes)')
