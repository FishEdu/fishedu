"""seed eco tips PL + EN"""

from alembic import op
import sqlalchemy as sa

from utils.utils import get_utc_date

# revision identifiers
revision = "c554f6cc5c4a"
down_revision = '9e4c6ba13a25'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    now = get_utc_date()

    pl_data = [
        (
            "UNIKAJ CIĘŻARKÓW OŁOWIANYCH",
            """Ołów pozostawiony w środowisku naturalnym (np. gdy zgubisz ciężarek, gdy zdarzy się zaczep, itp.) może szkodliwie wpływać na organizmy żywe.
Jest silnie trujący dla ryb, płazów i bezkręgowców. Uszkadza ich skrzela, zaburza układ nerwowy i utrudnia procesy rozrodcze.
Hamuje wzrost niektórych gatunków roślin wodnych oraz ogranicza procesy rozkładu materii organicznej przez mikroorganizmy.
Ptaki mogą połykać ołowiane ciężarki z dna, myląc je z drobnymi kamykami potrzebnymi do trawienia pokarmu. Skutkuje to śmiertelnym zatruciem.

Zamiast nich możesz użyć:
- ciężarków wolframowych – w metodzie SPININGOWEJ
- ciężarków cynowych – w metodzie MUCHOWEJ
- ciężarków kamiennych – w metodzie WŁOSOWEJ

Wiele łowisk komercyjnych na terenie Unii Europejskiej wycofuje ołów z użycia."""
        ),
        (
            "JAK UWALNIAĆ PRZYNĘTY Z ZACZEPÓW",
            """- metoda „na kija”
- metoda „na ciężarek”"""
        ),
        (
            "NĘCENIE Z GŁOWĄ",
            """- nęć z umiarem
- nęcenie wstępne – używaj zanęt zostawiających w wodzie ślad zapachowy i wizualny → wtedy możesz użyć mniej a nęcić skuteczniej. Duża ilość pozostawionej zanęty w wodzie, której ryby nie zjedzą, może powodować przyrost glonów.
- nie używaj suchych ziaren kukurydzy! Ryby nie są nią zainteresowane, nie zjadają jej, więc ziarna zostają w wodzie, psują się i powodują np. przyrost glonów
- używaj zanęt sprawdzonych producentów. Te tanie, z niesprawdzonego źródła mogą się przyczyniać do niestrawności, lub chorób ryb, oraz zwiększyć i przyspieszyć zakwit wody."""
        ),
        (
            "SIATKI",
            """Do przetrzymywania ryb podczas łowienia używaj siatek długich i o dużej średnicy. Wówczas ryby nie będą w niej się o siebie ocierały i będą mniej zestresowane."""
        ),
        (
            "PODBIERAK",
            """Używaj podbieraków z gumowaną, lub żyłkowaną siatką. Ryby nie będą się o nią kaleczyły i łatwiej będzie wyplątać z niej żyłkę i przynętę z haczykiem."""
        ),
        (
            "ŻYŁKI NAD WODĄ",
            """Pozostawione nad wodą żyłki to śmiertelne zagrożenie dla ptaków i innych zwierząt, które tam żyją. Mogą się w nie zaplątać i już nie uwolnić. Dryfujący w wodzie plastik to zagrożenie dla ryb. Śmieci, które zostawisz w wodzie i nad wodą mogą do Ciebie wrócić – gdy będziesz np. się kąpać w jeziorze, albo pić wodę ze strumyka.
Zabieraj z sobą to, co Twoje.
Możesz też się postarać kupić żyłki biodegradowalne."""
        ),
    ]

    en_data = [
        (
            "AVOID LEAD SINKERS",
            """Lead left in the natural environment (e.g., when you lose a sinker or get snagged) can negatively affect living organisms.
It is highly toxic to fish, amphibians, and invertebrates. It damages their gills, disrupts the nervous system, and interferes with reproduction.
It inhibits the growth of some aquatic plants and limits the decomposition of organic matter by microorganisms.
Birds may swallow lead sinkers from the bottom, mistaking them for small stones needed for digestion, which can result in fatal poisoning.

Instead, you can use:
- tungsten sinkers – for spinning
- tin sinkers – for fly fishing
- stone sinkers – for hair‑rig carp fishing

Many commercial fisheries across the European Union are phasing out the use of lead."""
        ),
        (
            "HOW TO FREE LURES FROM SNAGS",
            """- rod‑pull method
- sinker‑drop method"""
        ),
        (
            "SMART BAITING",
            """- bait in moderation
- pre‑baiting – use groundbaits that leave a scent and visual trail in the water → this allows you to use less bait while being more effective. Large amounts of uneaten bait can cause algae growth.
- do not use dry corn kernels! Fish are not interested in them, do not eat them, and the kernels rot in the water, contributing to algae blooms
- use groundbaits from reputable manufacturers. Cheap, low‑quality mixes may cause digestive issues or diseases in fish and accelerate water bloom."""
        ),
        (
            "KEEPNETS",
            """When holding fish during a session, use long keepnets with a large diameter. This prevents fish from rubbing against each other and reduces stress."""
        ),
        (
            "LANDING NET",
            """Use landing nets with rubberized or monofilament mesh. Fish will not injure themselves, and it will be easier to untangle your line and hook."""
        ),
        (
            "FISHING LINES NEAR WATER",
            """Fishing lines left near the water are deadly to birds and other animals living there. They can become entangled and unable to free themselves.
Floating plastic is dangerous to fish. Trash left in or near the water can come back to you — for example, when you swim in the lake or drink from a stream.
Take everything you brought with you.
You can also try using biodegradable fishing lines."""
        ),
    ]

    for title, desc in pl_data:
        conn.execute(
            sa.text(
                """
                INSERT INTO eco_tips_pl_translations (title, description, created_at, modified_at)
                VALUES (:title, :description, :created_at, :modified_at)
                """
            ),
            {"title": title, "description": desc, "created_at": now, "modified_at": now}
        )

    for title, desc in en_data:
        conn.execute(
            sa.text(
                """
                INSERT INTO eco_tips_en_translations (title, description, created_at, modified_at)
                VALUES (:title, :description, :created_at, :modified_at)
                """
            ),
            {"title": title, "description": desc, "created_at": now, "modified_at": now}
        )


def downgrade():
    op.execute("DELETE FROM eco_tips_pl_translations")
    op.execute("DELETE FROM eco_tips_en_translations")

