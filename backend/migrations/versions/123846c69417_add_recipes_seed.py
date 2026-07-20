"""Add recipes seed

Revision ID: 123846c69417
Revises: 910e200af7fe
Create Date: 2026-07-17 23:11:57.933952

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from utils.utils import get_utc_date


# revision identifiers, used by Alembic.
revision: str = '123846c69417'
down_revision: Union[str, Sequence[str], None] = '910e200af7fe'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    conn = op.get_bind()
    now = get_utc_date()

    recipes = [
        {
            "pl_name": "Zanęta na rzeki na drobne ryby",
            "en_name": "River Groundbait for Small Fish",

            "pl_content": """Polecana na:
- małe płocie
- małe leszcze
- małe krąpie
- ukleje

Składniki:
- 1 kg zanęty „Lorpio Magnetic Roach”
- 1 kg gliny wiążącej
- 1 łyżeczka atraktora „Anpio Karmel”
- 4 łyżki pieczywa fluo
- 100 ml pinki
- 650 ml wody

Przygotowanie:
Wymieszaj wszystkie suche składniki.
Powoli dolewaj wodę do uzyskania odpowiedniej konsystencji.
Pozostaw na około 20 minut.
Przetrzyj przez sito z grubymi oczkami.

Sposób użycia:
- bolonka – wrzucaj małe kule
- tyczka – podawaj kubkiem zanętowym
- feeder – przed rozpoczęciem łowienia napełnij kilka razy koszyczek zanętą""",

            "en_content": """Recommended for:
- small roach
- small bream
- silver bream
- bleak

Ingredients:
- 1 kg "Lorpio Magnetic Roach" groundbait
- 1 kg binding clay
- 1 teaspoon "Anpio Caramel" attractor
- 4 tablespoons fluorescent breadcrumbs
- 100 ml pinkies
- 650 ml water

Preparation:
Mix all dry ingredients.
Slowly add water until the proper consistency is achieved.
Leave to rest for about 20 minutes.
Sieve through a coarse mesh.

How to use:
- Bolognese rod – throw small balls
- Pole fishing – feed with a pole cup
- Feeder – cast several feeder baskets before fishing
"""
        },
        {
            "pl_name": "Zanęta na rzeki na duże ryby",
            "en_name": "River Groundbait for Large Fish",

            "pl_content": """Polecana na:
- karpie
- karasie
- duże leszcze i płocie
- liny

Składniki:
- 1 kg zanęty „Lorpio Magnetic Bream”
- 1 kg gliny wiążącej
- 1 łyżeczka atraktora „Anpio Karmel”
- 4 łyżki pieczywa fluo
- 100 ml siekanej dendrobeny
- 650 ml wody

Przygotowanie:
Wymieszaj wszystkie suche składniki.
Powoli dolewaj wodę do uzyskania odpowiedniej konsystencji.
Najlepsza gęstość to taka, aby można było ulepić zwartą kulę.
Pozostaw mieszankę na około 20 minut.
Następnie przetrzyj masę przez sito z grubymi oczkami.

Sposób użycia:
- bolonka – wrzucaj małe kule w kilku miejscach, przez które będzie przepływał spławik
- tyczka – podawaj kule kubkiem zanętowym centralnie w miejsce łowienia
- feeder – przed rozpoczęciem łowienia zarzuć kilka razy samym koszyczkiem z zanętą""",

            "en_content": """Recommended for:
- carp
- crucian carp
- large bream and roach
- tench

Ingredients:
- 1 kg "Lorpio Magnetic Bream" groundbait
- 1 kg binding clay
- 1 teaspoon "Anpio Caramel" attractor
- 4 tablespoons fluorescent breadcrumbs
- 100 ml chopped dendrobaena worms
- 650 ml water

Preparation:
Mix all dry ingredients.
Slowly add water until the proper consistency is achieved.
The ideal consistency allows you to form compact balls.
Leave the mixture to rest for about 20 minutes.
Then sieve the mixture through a coarse mesh.

How to use:
- Bolognese rod – throw small balls in several spots where the float will pass
- Pole fishing – feed the balls directly into the fishing spot using a pole cup
- Feeder – cast the feeder basket several times before starting fishing"""
        },
        {
            "pl_name": "Zanęta na ukleje",
            "en_name": "Groundbait for Bleak",

            "pl_content": """Polecana na:
- ukleje

Składniki:
- 1 kg zanęty „Traper” uklejowej
- 125 ml topionej pinki
- 1 litr wody

Przygotowanie:
Dokładnie wymieszaj składniki z wodą.
Pozostaw zanętę na 30 minut.
Następnie przetrzyj przez sito.

Sposób użycia:
Przed rozpoczęciem łowienia wrzuć w łowisko kilka garści zanęty.
Podczas łowienia, po kilku wyholowanych rybach, wrzucaj do wody kolejną garść zanęty.""",

            "en_content": """Recommended for:
- bleak

Ingredients:
- 1 kg "Traper" bleak groundbait
- 125 ml softened pinkies
- 1 liter water

Preparation:
Mix all ingredients thoroughly with water.
Leave the groundbait to rest for 30 minutes.
Then sieve it through a mesh.

How to use:
Before fishing, throw several handfuls of groundbait into the fishing spot.
During fishing, after catching several fish, add another handful of groundbait."""
        },
        {
            "pl_name": "Zanęta na jeziora na małe ryby",
            "en_name": "Lake Groundbait for Small Fish",

            "pl_content": """Polecana na:
- płocie
- krąpie
- leszcze

Składniki:
- 1 kg zanęty „Sensas Gros Gardens”
- 1 kg gliny rozpraszającej brązowej
- 1 łyżeczka atraktora „Anpio Karmel”
- 4 łyżki pieczywa fluo
- 4 łyżki pinki (kolor mix)
- 650 ml wody

Przygotowanie:
Wymieszaj wszystkie suche składniki.
Powoli dolewaj wodę do uzyskania odpowiedniej konsystencji.
Najlepsza gęstość to taka, aby można było ulepić zwartą kulę.
Pozostaw mieszankę na około 20 minut.
Następnie przetrzyj masę przez sito z grubymi oczkami.

Sposób użycia:
- metoda odległościowa – wstrzeliwuj kule procą w łowisko
- bat – wrzucaj kule z ręki
- tyczka – podawaj zanętę kubkiem zanętowym
- feeder – podawaj zanętę w koszyczku""",

            "en_content": """Recommended for:
- roach
- silver bream
- bream

Ingredients:
- 1 kg "Sensas Gros Gardens" groundbait
- 1 kg brown dispersing clay
- 1 teaspoon "Anpio Caramel" attractor
- 4 tablespoons fluorescent breadcrumbs
- 4 tablespoons pinkies (mixed colors)
- 650 ml water

Preparation:
Mix all dry ingredients.
Slowly add water until the proper consistency is achieved.
The ideal consistency allows you to form compact balls.
Leave the mixture to rest for about 20 minutes.
Then sieve through a coarse mesh.

How to use:
- Match fishing – shoot balls into the fishing spot using a catapult
- Whip fishing – throw balls by hand
- Pole fishing – feed using a pole cup
- Feeder fishing – place the groundbait in the feeder basket"""
        },
        {
            "pl_name": "Zanęta na jeziora na duże ryby",
            "en_name": "Lake Groundbait for Large Fish",

            "pl_content": """Polecana na:
- liny
- karpie

Składniki:
- 1 kg zanęty spożywczej „Champion Feed Wonder Black”
- ½ kg gliny rozpraszającej czarnej
- ½ kg ziemi torfowej
- 1 łyżeczka atraktora „Anpio Karmel”
- 4 łyżki pieczywa fluo
- 100 ml siekanej dendrobeny

Przygotowanie:
Wymieszaj wszystkie suche składniki.
Powoli dolewaj wodę do uzyskania odpowiedniej konsystencji.
Najlepsza gęstość to taka, aby można było ulepić zwartą kulę.
Pozostaw mieszankę na około 20 minut.
Następnie przetrzyj masę przez sito z grubymi oczkami.

Sposób użycia:
- metoda odległościowa – wstrzeliwuj kule procą w łowisko
- bat – wrzucaj kule z ręki
- tyczka – podawaj zanętę kubkiem zanętowym
- feeder – podawaj zanętę w koszyczku""",

            "en_content": """Recommended for:
- tench
- carp

Ingredients:
- 1 kg "Champion Feed Wonder Black" groundbait
- ½ kg black dispersing clay
- ½ kg peat soil
- 1 teaspoon "Anpio Caramel" attractor
- 4 tablespoons fluorescent breadcrumbs
- 100 ml chopped dendrobaena worms

Preparation:
Mix all dry ingredients.
Slowly add water until the proper consistency is achieved.
The ideal consistency allows you to form compact balls.
Leave the mixture to rest for about 20 minutes.
Then sieve through a coarse mesh.

How to use:
- Match fishing – shoot balls into the fishing spot using a catapult
- Whip fishing – throw balls by hand
- Pole fishing – feed using a pole cup
- Feeder fishing – place the groundbait in the feeder basket"""
        },
        {
            "pl_name": "Zanęta na method feeder",
            "en_name": "Method Feeder Groundbait",

            "pl_content": """Polecana na:
- karpie
- leszcze
- liny
- płocie
- inne ryby spokojnego żeru

Składniki:
- 1 kg „Method Mix Match Pro Brown”
- 300 ml wody

Przygotowanie:
Rozrób mieszankę w wodzie.
Pozostaw ją na 15 minut.
Po tym czasie jest gotowa do użycia.

Dodatkowo:
Wraz z tą zanętą podawaj pellet.

Przygotowanie pelletu:
- 1 kg pelletu „Aller Aqua Classic” 2 mm
- namaczaj pellet w wodzie przez 1 minutę w pudełku z sitkiem
- wyjmij pellet i pozostaw na 20 minut""",

            "en_content": """Recommended for:
- carp
- bream
- tench
- roach
- other coarse fish

Ingredients:
- 1 kg "Method Mix Match Pro Brown"
- 300 ml water

Preparation:
Mix the groundbait with water.
Leave it to rest for 15 minutes.
After this time it is ready to use.

Additional:
Use pellets together with this groundbait.

Pellet preparation:
- 1 kg "Aller Aqua Classic" 2 mm pellets
- soak pellets in water for 1 minute in a sieve box
- remove and leave to rest for 20 minutes"""
        },
        {
            "pl_name": "Miks słodki na method feeder",
            "en_name": "Sweet Method Feeder Mix",

            "pl_content": """Polecana na:
- karpie
- amury
- leszcze
- liny
- płocie
- inne ryby spokojnego żeru

Składniki:
- 1 kg „Method Mix Osmo” kukurydziany
- 300 ml wody

Przygotowanie:
Rozrób mieszankę w wodzie.
Pozostaw ją na 15 minut.
Po tym czasie jest gotowa do podawania.

Dodatkowo:
Wraz z tą zanętą podawaj pellet.

Przygotowanie pelletu:
- 1 kg pelletu „Esca Feeder Swim” 2 mm
- namaczaj pellet w wodzie przez 1 minutę w pudełku z sitkiem
- wyjmij pellet i pozostaw na 20 minut""",

            "en_content": """Recommended for:
- carp
- grass carp
- bream
- tench
- roach
- other coarse fish

Ingredients:
- 1 kg "Method Mix Osmo" corn mix
- 300 ml water

Preparation:
Mix the groundbait with water.
Leave it to rest for 15 minutes.
After this time it is ready to use.

Additional:
Use pellets together with this groundbait.

Pellet preparation:
- 1 kg "Esca Feeder Swim" 2 mm pellets
- soak pellets in water for 1 minute in a sieve box
- remove and leave to rest for 20 minutes"""
        },
        {
            "pl_name": "Miks śmierdzący na metodę włosową",
            "en_name": "Smelly Hair Rig Mix",

            "pl_content": """Polecana na:
- karpie
- amury

Składniki:
- ½ kg krojonych kulek proteinowych „NLT Squid”
- ½ kg krojonych kulek proteinowych „Invader” truskawka + ryba
- ½ kg pelletu „Aller Aqua” 8 mm
- 1 kg gotowanej kukurydzy
- 1 kg gotowanej konopi

Przygotowanie:
Wymieszaj wszystkie składniki.
Zalej atraktorem squid.
Przechowuj mieszankę w wiaderku.

Sposób użycia:
Możesz podawać mieszankę za pomocą łódki zanętowej, pontonu lub spomba (rakiety zanętowej).""",

            "en_content": """Recommended for:
- carp
- grass carp

Ingredients:
- ½ kg chopped boilies "NLT Squid"
- ½ kg chopped boilies "Invader" strawberry + fish
- ½ kg "Aller Aqua" 8 mm pellets
- 1 kg cooked corn
- 1 kg cooked hemp

Preparation:
Mix all ingredients.
Pour squid attractor over the mix.
Store the mixture in a bucket.

How to use:
You can introduce the mix using a bait boat, boat, or spomb."""
        },
        {
            "pl_name": "Miks słodki na metodę włosową",
            "en_name": "Sweet Hair Rig Mix",

            "pl_content": """Polecana na:
- karpie
- amury

Składniki:
- ½ kg krojonych kulek proteinowych „NLT Whisky”
- ½ kg kulek proteinowych „Invader” ananas
- ½ kg granulatu kukurydzianego dowolnej marki
- 1 kg gotowanej kukurydzy
- 1 kg gotowanej konopi

Przygotowanie:
Wymieszaj wszystkie składniki.
Zalej słodkim atraktorem, np. o zapachu truskawki lub ananasa.
Przechowuj mieszankę w wiaderku.

Sposób użycia:
Możesz podawać mieszankę za pomocą łódki zanętowej, pontonu lub spomba.""",

            "en_content": """Recommended for:
- carp
- grass carp

Ingredients:
- ½ kg chopped boilies "NLT Whisky"
- ½ kg "Invader" pineapple boilies
- ½ kg corn granules of any brand
- 1 kg cooked corn
- 1 kg cooked hemp

Preparation:
Mix all ingredients.
Pour a sweet attractor over the mix, for example strawberry or pineapple flavor.
Store the mixture in a bucket.

How to use:
You can introduce the mix using a bait boat, boat, or spomb."""
        },
        {
            "pl_name": "Przepis na gotowane ziarno na przynętę",
            "en_name": "Recipe for Cooked Grain Bait",

            "pl_content": """Polecana na:
- wszystkie ryby spokojnego żeru (ryby roślinożerne)

Składniki:
- ½ szklanki suchej kaszy pęczak

Przygotowanie:
Wsyp kaszę do termosu.
Zalej wrzątkiem.
Nie wypełniaj termosu wodą do samej krawędzi - powinien być wypełniony do około ¾ wysokości.
Zakręć termos i pozostaw na 30 minut.

Po tym czasie sprawdź, czy kasza jest miękka i można ją rozgnieść w rękach.
Jeśli tak, można ją założyć na haczyk jako przynętę.""",

            "en_content": """Recommended for:
- all coarse fish (herbivorous fish)

Ingredients:
- ½ cup dry pearl barley

Preparation:
Put the barley into a thermos.
Pour boiling water over it.
Do not fill the thermos completely - it should be filled to about ¾ of its height.
Close the thermos and leave for 30 minutes.

After this time check if the barley is soft and can be crushed by hand.
If so, it can be used as hook bait."""
        },
        {
            "pl_name": "Łubin jako przynęta",
            "en_name": "Lupin as Bait",

            "pl_content": """Polecana na:
- ryby spokojnego żeru

Przygotowanie:
Suche ziarno łubinu mocz w wodzie przez 5 godzin.
Następnie gotuj je w wodzie z łyżeczką sody oczyszczonej do momentu uzyskania miękkiej i plastycznej konsystencji.

Sposób użycia:
Zakładaj na haczyk nr 10 lub 12.
Możesz również dodawać łubin do zanęty.""",

            "en_content": """Recommended for:
- coarse fish

Preparation:
Soak dry lupin seeds in water for 5 hours.
Then boil them in water with one teaspoon of baking soda until they become soft and have a flexible consistency.

How to use:
Use on a size 10 or 12 hook.
You can also add lupin to groundbait."""
        }

    ]

    recipe_ids = []

    for _ in recipes:
        result = conn.execute(
            sa.text("""
                INSERT INTO recipes (
                    created_at,
                    modified_at
                )
                VALUES (
                    :created_at,
                    :modified_at
                )
                RETURNING id
            """),
            {
                "created_at": now,
                "modified_at": now,
            },
        )

        recipe_ids.append(result.scalar())

    for recipe_id, recipe in zip(recipe_ids, recipes):
        conn.execute(
            sa.text("""
                INSERT INTO recipes_pl_translations (
                    recipe_id,
                    name,
                    content,
                    created_at,
                    modified_at
                )
                VALUES (
                    :recipe_id,
                    :name,
                    :content,
                    :created_at,
                    :modified_at
                )
            """),
            {
                "recipe_id": recipe_id,
                "name": recipe["pl_name"],
                "content": recipe["pl_content"],
                "created_at": now,
                "modified_at": now,
            },
        )

        conn.execute(
            sa.text("""
                INSERT INTO recipes_en_translations (
                    recipe_id,
                    name,
                    content,
                    created_at,
                    modified_at
                )
                VALUES (
                    :recipe_id,
                    :name,
                    :content,
                    :created_at,
                    :modified_at
                )
            """),
            {
                "recipe_id": recipe_id,
                "name": recipe["en_name"],
                "content": recipe["en_content"],
                "created_at": now,
                "modified_at": now,
            },
        )


def downgrade():
    conn = op.get_bind()

    pl_recipes_to_delete = [
        "Zanęta na rzeki na drobne ryby",
        "Zanęta na rzeki na duże ryby",
        "Zanęta na ukleje",
        "Zanęta na jeziora na małe ryby",
        "Zanęta na jeziora na duże ryby",
        "Zanęta na method feeder",
        "Miks słodki na method feeder",
        "Miks śmierdzący na metodę włosową",
        "Miks słodki na metodę włosową",
        "Przepis na gotowane ziarno na przynętę",
        "Łubin jako przynęta"
    ]

    en_recipes_to_delete = [
        "River Groundbait for Small Fish",
        "River Groundbait for Large Fish",
        "Groundbait for Bleak",
        "Lake Groundbait for Small Fish",
        "Lake Groundbait for Large Fish",
        "Method Feeder Groundbait",
        "Sweet Method Feeder Mix",
        "Smelly Hair Rig Mix",
        "Sweet Hair Rig Mix",
        "Recipe for Cooked Grain Bait",
        "Lupin as Bait"

    ]

    for name in pl_recipes_to_delete:
        conn.execute(
            sa.text("""
                DELETE FROM recipes_pl_translations
                WHERE name = :name
            """),
            {
                "name": name
            }
        )

    for name in en_recipes_to_delete:
        conn.execute(
            sa.text("""
                DELETE FROM recipes_en_translations
                WHERE name = :name
            """),
            {
                "name": name
            }
        )

    conn.execute(
        sa.text("""
            DELETE FROM recipes
            WHERE id NOT IN (
                SELECT recipe_id FROM recipes_pl_translations
                UNION
                SELECT recipe_id FROM recipes_en_translations
            )
        """)
    )