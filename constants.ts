
import { SourceDataItem, TriviaCategory, Difficulty, DifficultySetting, MemoryDifficultySetting, OrderVerseDifficultySetting, ReciteVerseDifficultySetting, BookData, BookSortDifficultySetting } from './types';

// --- CONFIGURATION ---
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzMbfnk5hsj0Y1GW4SLKR1CzCw0-VUJPrht4S7ct9pndEZVsz4ZK5nD5J1P2zboYSo/exec"; 

export const DEFAULT_QUESTIONS_PER_GAME = 10; 

export const CATEGORIES: TriviaCategory[] = [
  TriviaCategory.ALL,
  TriviaCategory.PROMISES,
  TriviaCategory.COMMANDMENTS,
  TriviaCategory.JESUS_SAID,
  TriviaCategory.BIBLE_SUMMARIES,
  TriviaCategory.CHAPTER_COUNTS,
];

// NOTE: -1 indicates "Unlimited/All Available" for counts.
export const DIFFICULTY_LEVELS: DifficultySetting[] = [
  { level: Difficulty.EASY, questions: -1, label: "Modo Estándar (Sin tiempo)", timerDuration: 0 }, 
];

export const MEMORY_DIFFICULTY_SETTINGS: MemoryDifficultySetting[] = [
  { level: Difficulty.EASY, pairs: 6, grid: { rows: 3, cols: 4 }, label: "Entrenamiento (Sin tiempo)" }, 
  { level: Difficulty.MEDIUM, pairs: 8, grid: { rows: 4, cols: 4 }, label: "Medio (8 Pares)" },
  { level: Difficulty.DIFFICULT, pairs: 10, grid: { rows: 4, cols: 5 }, label: "Difícil (10 Pares)" },
];

export const ORDER_VERSE_DIFFICULTY_SETTINGS: OrderVerseDifficultySetting[] = [
  { level: Difficulty.EASY, versesToOrder: -1, label: "Modo Estándar (Sin tiempo)", timerPerItem: 0}, 
];

export const RECITE_VERSE_DIFFICULTY_SETTINGS: ReciteVerseDifficultySetting[] = [
  { level: Difficulty.EASY, versesToRecite: -1, visibleLettersMode: 'firstAndLast', label: "Modo Estándar (Sin tiempo)", timerPerItem: 0}, 
];

// Re-purposing Difficulty levels to act as "Category Selectors" for Book Sort
export const BOOK_SORT_DIFFICULTY_SETTINGS: BookSortDifficultySetting[] = [
  { level: Difficulty.EASY, booksToOrder: -1, criteria: 'CANONICAL', filterGroup: 'PENTATEUCH', label: "La Ley (Pentateuco)", timerDuration: 0 },
  { level: Difficulty.MEDIUM, booksToOrder: -1, criteria: 'CANONICAL', filterGroup: 'GOSPELS', label: "Los Evangelios", timerDuration: 0 },
  { level: Difficulty.DIFFICULT, booksToOrder: -1, criteria: 'CANONICAL', filterGroup: 'PAULINE_EPISTLES', label: "Cartas de Pablo", timerDuration: 0 },
];

// Update Levels based on User Request
// Removing 'HISTORICAL_NT' (Level 6 previously) as it only has 1 book (Hechos) which causes errors.
export const BOOK_SORT_OPTIONS_EXTENDED: BookSortDifficultySetting[] = [
    { level: 'Level 1' as any, booksToOrder: -1, criteria: 'CANONICAL', filterGroup: 'PENTATEUCH', label: "Nivel 1: La Ley (Pentateuco)", timerDuration: 0 },
    { level: 'Level 2' as any, booksToOrder: -1, criteria: 'CANONICAL', filterGroup: 'HISTORICAL_OT', label: "Nivel 2: Históricos (A.T.)", timerDuration: 0 },
    { level: 'Level 3' as any, booksToOrder: -1, criteria: 'CANONICAL', filterGroup: 'POETIC', label: "Nivel 3: Poéticos y Sapienciales", timerDuration: 0 },
    { level: 'Level 4' as any, booksToOrder: -1, criteria: 'CANONICAL', filterGroup: 'PROPHETS', label: "Nivel 4: Profetas (A.T.)", timerDuration: 0 },
    { level: 'Level 5' as any, booksToOrder: -1, criteria: 'CANONICAL', filterGroup: 'GOSPELS', label: "Nivel 5: Evangelios", timerDuration: 0 },
    { level: 'Level 6' as any, booksToOrder: -1, criteria: 'CANONICAL', filterGroup: 'PAULINE_EPISTLES', label: "Nivel 6: Cartas de Pablo", timerDuration: 0 },
    { level: 'Level 7' as any, booksToOrder: -1, criteria: 'CANONICAL', filterGroup: 'FINAL_STAGE_NT', label: "Nivel 7: Hebreos, Stg, Pedro, Juan, Judas, Apoc.", timerDuration: 0 },
    { level: 'Level 8' as any, booksToOrder: -1, criteria: 'CANONICAL', filterGroup: 'ALL_OT', label: "Nivel 8: Todo el Antiguo Testamento", timerDuration: 0 },
    { level: 'Level 9' as any, booksToOrder: -1, criteria: 'CANONICAL', filterGroup: 'ALL_NT', label: "Nivel 9: Todo el Nuevo Testamento", timerDuration: 0 },
    { level: 'Level 10' as any, booksToOrder: -1, criteria: 'CANONICAL', filterGroup: 'ALL', label: "Nivel Final: Toda la Biblia", timerDuration: 0 },
];

// --- BIBLE BOOKS DATA ---
export const BIBLE_BOOKS_DATA: BookData[] = [
    // --- OLD TESTAMENT ---
    // Pentateuch (Law)
    { id: 'OT_01', name: 'Génesis', testament: 'Old', group: 'PENTATEUCH', canonicalOrder: 1, chronologicalOrder: 1, chapters: 50, author: 'Moisés', summary: 'El libro de los inicios: la creación del universo, la caída del hombre, el diluvio universal y la elección de los patriarcas (Abraham, Isaac, Jacob y José) para formar el pueblo de Dios.' },
    { id: 'OT_02', name: 'Éxodo', testament: 'Old', group: 'PENTATEUCH', canonicalOrder: 2, chronologicalOrder: 3, chapters: 40, author: 'Moisés', summary: 'Relata la liberación de Israel de la esclavitud en Egipto a través de Moisés, las diez plagas, el cruce del Mar Rojo y la entrega de la Ley y los Diez Mandamientos en el Monte Sinaí.' },
    { id: 'OT_03', name: 'Levítico', testament: 'Old', group: 'PENTATEUCH', canonicalOrder: 3, chronologicalOrder: 4, chapters: 27, author: 'Moisés', summary: 'Manual de santidad para los sacerdotes y el pueblo. Detalla el sistema de sacrificios, las fiestas solemnes y las leyes de pureza necesarias para habitar cerca de un Dios santo.' },
    { id: 'OT_04', name: 'Números', testament: 'Old', group: 'PENTATEUCH', canonicalOrder: 4, chronologicalOrder: 5, chapters: 36, author: 'Moisés', summary: 'Narra los 40 años de peregrinación por el desierto debido a la incredulidad del pueblo. Incluye censos de las tribus y lecciones sobre la fidelidad de Dios ante la rebelión humana.' },
    { id: 'OT_05', name: 'Deuteronomio', testament: 'Old', group: 'PENTATEUCH', canonicalOrder: 5, chronologicalOrder: 6, chapters: 34, author: 'Moisés', summary: 'Significa "Segunda Ley". Son los últimos discursos de Moisés antes de morir, recordando a la nueva generación los mandamientos de Dios y llamándolos a la obediencia antes de entrar a la Tierra Prometida.' },

    // Historical OT
    { id: 'OT_06', name: 'Josué', testament: 'Old', group: 'HISTORICAL_OT', canonicalOrder: 6, chronologicalOrder: 7, chapters: 24, author: 'Josué', summary: 'Describe la conquista militar de Canaán bajo el liderazgo de Josué, la caída de Jericó y la distribución de la Tierra Prometida entre las doce tribus de Israel.' },
    { id: 'OT_07', name: 'Jueces', testament: 'Old', group: 'HISTORICAL_OT', canonicalOrder: 7, chronologicalOrder: 8, chapters: 21, author: 'Samuel (tradición)', summary: 'Un periodo oscuro de ciclos repetitivos: pecado, opresión, clamor y liberación. Dios levanta líderes imperfectos como Gedeón y Sansón para rescatar a su pueblo.' },
    { id: 'OT_08', name: 'Rut', testament: 'Old', group: 'HISTORICAL_OT', canonicalOrder: 8, chronologicalOrder: 9, chapters: 4, author: 'Desconocido', summary: 'Una hermosa historia de lealtad, amor y redención. Rut, una mujer moabita, se convierte en bisabuela del rey David, mostrando que el plan de Dios incluye a los gentiles.' },
    { id: 'OT_09', name: '1 Samuel', testament: 'Old', group: 'HISTORICAL_OT', canonicalOrder: 9, chronologicalOrder: 10, chapters: 31, author: 'Samuel/Natán', summary: 'La transición de Israel de una teocracia dirigida por jueces a una monarquía. Presenta al profeta Samuel, el fracaso del rey Saúl y la unción del joven David.' },
    { id: 'OT_10', name: '2 Samuel', testament: 'Old', group: 'HISTORICAL_OT', canonicalOrder: 10, chronologicalOrder: 11, chapters: 24, author: 'Natán/Gad', summary: 'Narra el reinado de 40 años de David. Muestra sus triunfos militares, la expansión del reino, su grave pecado con Betsabé y las dolorosas consecuencias familiares y nacionales.' },
    { id: 'OT_11', name: '1 Reyes', testament: 'Old', group: 'HISTORICAL_OT', canonicalOrder: 11, chronologicalOrder: 12, chapters: 22, author: 'Jeremías', summary: 'Comienza con la gloria del reinado de Salomón y la construcción del Templo. Luego detalla la trágica división del reino en Norte (Israel) y Sur (Judá) y el ministerio del profeta Elías.' },
    { id: 'OT_12', name: '2 Reyes', testament: 'Old', group: 'HISTORICAL_OT', canonicalOrder: 12, chronologicalOrder: 13, chapters: 25, author: 'Jeremías', summary: 'Continúa la historia de los reyes divididos, destacando los milagros de Eliseo. Termina con la destrucción de ambos reinos y el exilio a Asiria y Babilonia debido a la idolatría.' },
    { id: 'OT_13', name: '1 Crónicas', testament: 'Old', group: 'HISTORICAL_OT', canonicalOrder: 13, chronologicalOrder: 14, chapters: 29, author: 'Esdras (tradición)', summary: 'Revisión de la historia de Israel desde una perspectiva espiritual y sacerdotal. Se centra en las genealogías y en los preparativos positivos de David para la adoración y el Templo.' },
    { id: 'OT_14', name: '2 Crónicas', testament: 'Old', group: 'HISTORICAL_OT', canonicalOrder: 14, chronologicalOrder: 19, chapters: 36, author: 'Esdras (tradición)', summary: 'Se enfoca exclusivamente en los reyes del Sur (Judá), destacando los avivamientos religiosos bajo reyes como Ezequías y Josías, y culminando con el edicto de Ciro para el retorno.' },
    { id: 'OT_15', name: 'Esdras', testament: 'Old', group: 'HISTORICAL_OT', canonicalOrder: 15, chronologicalOrder: 35, chapters: 10, author: 'Esdras', summary: 'Relata el regreso de los judíos del exilio babilónico en dos grupos (con Zorobabel y Esdras), la reconstrucción del Templo en medio de oposición y la reforma espiritual del pueblo.' },
    { id: 'OT_16', name: 'Nehemías', testament: 'Old', group: 'HISTORICAL_OT', canonicalOrder: 16, chronologicalOrder: 36, chapters: 13, author: 'Nehemías', summary: 'La historia de la reconstrucción de los muros de Jerusalén bajo el liderazgo valiente de Nehemías. Enfatiza la oración, la acción práctica y la renovación del pacto con Dios.' },
    { id: 'OT_17', name: 'Ester', testament: 'Old', group: 'HISTORICAL_OT', canonicalOrder: 17, chronologicalOrder: 34, chapters: 10, author: 'Desconocido', summary: 'Aunque no menciona el nombre de Dios, muestra su providencia salvando a los judíos en Persia del genocidio planeado por Amán, a través de la reina Ester y su primo Mardoqueo.' },

    // Poetic / Wisdom
    { id: 'OT_18', name: 'Job', testament: 'Old', group: 'POETIC', canonicalOrder: 18, chronologicalOrder: 2, chapters: 42, author: 'Desconocido', summary: 'Aborda el difícil problema del sufrimiento humano y la soberanía de Dios. Narra la pérdida de todo lo que tenía Job, sus debates con amigos y la respuesta final de Dios en un torbellino.' },
    { id: 'OT_19', name: 'Salmos', testament: 'Old', group: 'POETIC', canonicalOrder: 19, chronologicalOrder: 15, chapters: 150, author: 'David y otros', summary: 'El himnario de Israel. Una colección de 150 cánticos y oraciones que expresan toda la gama de emociones humanas: desde la alabanza y la gratitud hasta el lamento, la duda y la confianza.' },
    { id: 'OT_20', name: 'Proverbios', testament: 'Old', group: 'POETIC', canonicalOrder: 20, chronologicalOrder: 16, chapters: 31, author: 'Salomón', summary: 'Colección de dichos sabios para la vida práctica. Enseña que "el principio de la sabiduría es el temor de Jehová" y ofrece consejos sobre trabajo, palabras, familia y moralidad.' },
    { id: 'OT_21', name: 'Eclesiastés', testament: 'Old', group: 'POETIC', canonicalOrder: 21, chronologicalOrder: 17, chapters: 12, author: 'Salomón', summary: 'Una reflexión filosófica sobre el sentido de la vida. Concluye que, sin Dios, todo es "vanidad" (humo), y que el propósito del hombre es temer a Dios y guardar sus mandamientos.' },
    { id: 'OT_22', name: 'Cantares', testament: 'Old', group: 'POETIC', canonicalOrder: 22, chronologicalOrder: 18, chapters: 8, author: 'Salomón', summary: 'Un poema lírico que celebra el amor romántico y sexual dentro del matrimonio. También se interpreta alegóricamente como el amor entre Dios e Israel, o Cristo y la Iglesia.' },

    // Prophets (Major & Minor)
    { id: 'OT_23', name: 'Isaías', testament: 'Old', group: 'PROPHETS', canonicalOrder: 23, chronologicalOrder: 25, chapters: 66, author: 'Isaías', summary: 'El "Evangelio del Antiguo Testamento". Profetiza juicios, pero también consuelo. Contiene las profecías más claras sobre el Mesías, incluyendo su nacimiento virginal y su sufrimiento expiatorio.' },
    { id: 'OT_24', name: 'Jeremías', testament: 'Old', group: 'PROPHETS', canonicalOrder: 24, chronologicalOrder: 26, chapters: 52, author: 'Jeremías', summary: 'Conocido como el "profeta llorón". Predicó a una nación rebelde en los años previos a la caída de Jerusalén. Profetizó el "Nuevo Pacto" que Dios haría, escribiendo su ley en los corazones.' },
    { id: 'OT_25', name: 'Lamentaciones', testament: 'Old', group: 'PROPHETS', canonicalOrder: 25, chronologicalOrder: 29, chapters: 5, author: 'Jeremías', summary: 'Cinco poemas fúnebres que expresan el profundo dolor por la destrucción de Jerusalén. En medio de la tristeza, declara la esperanza central: "Grande es tu fidelidad".' },
    { id: 'OT_26', name: 'Ezequiel', testament: 'Old', group: 'PROPHETS', canonicalOrder: 26, chronologicalOrder: 27, chapters: 48, author: 'Ezequiel', summary: 'Profeta del exilio en Babilonia. Tuvo visiones extrañas y poderosas (como el valle de los huesos secos) sobre la gloria de Dios abandonando el Templo y la promesa de un futuro Templo restaurado.' },
    { id: 'OT_27', name: 'Daniel', testament: 'Old', group: 'PROPHETS', canonicalOrder: 27, chronologicalOrder: 28, chapters: 12, author: 'Daniel', summary: 'Narra la vida de integridad de Daniel y sus amigos en la corte de Babilonia (foso de leones, horno de fuego) y presenta visiones apocalípticas sobre el futuro de los imperios mundiales y el Reino de Dios.' },
    { id: 'OT_28', name: 'Oseas', testament: 'Old', group: 'PROPHETS', canonicalOrder: 28, chronologicalOrder: 22, chapters: 14, author: 'Oseas', summary: 'Dios ordena al profeta casarse con una mujer infiel (Gomer) para ilustrar vívidamente la infidelidad espiritual de Israel y el amor inquebrantable y redentor de Dios hacia su pueblo.' },
    { id: 'OT_29', name: 'Joel', testament: 'Old', group: 'PROPHETS', canonicalOrder: 29, chronologicalOrder: 24, chapters: 3, author: 'Joel', summary: 'Usa una plaga devastadora de langostas como advertencia del "Día del Señor". Profetiza el futuro derramamiento del Espíritu Santo sobre toda carne, cumplido en Pentecostés.' },
    { id: 'OT_30', name: 'Amós', testament: 'Old', group: 'PROPHETS', canonicalOrder: 30, chronologicalOrder: 20, chapters: 9, author: 'Amós', summary: 'Un pastor que ruge contra la injusticia social y la hipocresía religiosa en Israel. Denuncia que Dios desprecia los rituales vacíos cuando no hay justicia para los pobres.' },
    { id: 'OT_31', name: 'Abdías', testament: 'Old', group: 'PROPHETS', canonicalOrder: 31, chronologicalOrder: 21, chapters: 1, author: 'Abdías', summary: 'El libro más corto del AT. Pronuncia juicio contra la nación de Edom (descendientes de Esaú) por su soberbia y por alegrarse de la desgracia de su hermano Israel.' },
    { id: 'OT_32', name: 'Jonás', testament: 'Old', group: 'PROPHETS', canonicalOrder: 32, chronologicalOrder: 23, chapters: 4, author: 'Jonás', summary: 'La historia de un profeta rebelde que huye de Dios y es tragado por un gran pez. Muestra que la misericordia de Dios se extiende incluso a los enemigos paganos de Israel (Nínive) si se arrepienten.' },
    { id: 'OT_33', name: 'Miqueas', testament: 'Old', group: 'PROPHETS', canonicalOrder: 33, chronologicalOrder: 30, chapters: 7, author: 'Miqueas', summary: 'Denuncia a los líderes corruptos que "aborrecen el juicio". Contiene la famosa profecía de que el Mesías nacería en la pequeña aldea de Belén.' },
    { id: 'OT_34', name: 'Nahúm', testament: 'Old', group: 'PROPHETS', canonicalOrder: 34, chronologicalOrder: 31, chapters: 3, author: 'Nahúm', summary: 'Profecía gráfica y contundente sobre la destrucción definitiva de Nínive, el cruel imperio asirio. Declara que Dios es lento para la ira pero no tendrá por inocente al culpable.' },
    { id: 'OT_35', name: 'Habacuc', testament: 'Old', group: 'PROPHETS', canonicalOrder: 35, chronologicalOrder: 32, chapters: 3, author: 'Habacuc', summary: 'Un diálogo honesto entre el profeta y Dios. Habacuc cuestiona cómo Dios puede usar a los malvados babilonios para juzgar a Israel. Clave: "El justo por su fe vivirá".' },
    { id: 'OT_36', name: 'Sofonías', testament: 'Old', group: 'PROPHETS', canonicalOrder: 36, chronologicalOrder: 33, chapters: 3, author: 'Sofonías', summary: 'Predica sobre el inminente "Día de la Ira" de Jehová contra Judá y las naciones. Termina con una hermosa promesa de que Dios se regocijará sobre su remanente con cánticos.' },
    { id: 'OT_37', name: 'Hageo', testament: 'Old', group: 'PROPHETS', canonicalOrder: 37, chronologicalOrder: 37, chapters: 2, author: 'Hageo', summary: 'Profeta post-exilio que desafía al pueblo a dejar de priorizar sus propias casas y terminar de reconstruir el Templo de Dios, prometiendo que la gloria postrera será mayor.' },
    { id: 'OT_38', name: 'Zacarías', testament: 'Old', group: 'PROPHETS', canonicalOrder: 38, chronologicalOrder: 38, chapters: 14, author: 'Zacarías', summary: 'Lleno de visiones apocalípticas para animar la reconstrucción. Contiene muchas profecías mesiánicas: el rey humilde en un asno, la traición por 30 monedas y el traspasado.' },
    { id: 'OT_39', name: 'Malaquías', testament: 'Old', group: 'PROPHETS', canonicalOrder: 39, chronologicalOrder: 39, chapters: 4, author: 'Malaquías', summary: 'El último profeta del AT. Confronta el formalismo espiritual, los matrimonios mixtos y el robo de diezmos. Termina prometiendo la llegada de "Elías" antes del día del Señor.' },

    // --- NEW TESTAMENT ---
    // Gospels
    { id: 'NT_01', name: 'Mateo', testament: 'New', group: 'GOSPELS', canonicalOrder: 40, chronologicalOrder: 45, chapters: 28, author: 'Mateo', summary: 'Escrito principalmente para judíos. Presenta a Jesús como el Rey Mesías que cumple las profecías del AT. Incluye grandes bloques de enseñanza como el Sermón del Monte.' },
    { id: 'NT_02', name: 'Marcos', testament: 'New', group: 'GOSPELS', canonicalOrder: 41, chronologicalOrder: 44, chapters: 16, author: 'Marcos', summary: 'El evangelio más corto y lleno de acción. Presenta a Jesús como el Siervo Sufriente que vino a servir y dar su vida. Usa frecuentemente la palabra "inmediatamente".' },
    { id: 'NT_03', name: 'Lucas', testament: 'New', group: 'GOSPELS', canonicalOrder: 42, chronologicalOrder: 46, chapters: 24, author: 'Lucas', summary: 'Escrito para gentiles. Presenta a Jesús como el Hijo del Hombre, el Salvador perfecto de toda la humanidad. Destaca su compasión por los pobres, las mujeres y los marginados.' },
    { id: 'NT_04', name: 'Juan', testament: 'New', group: 'GOSPELS', canonicalOrder: 43, chronologicalOrder: 60, chapters: 21, author: 'Juan', summary: 'Teológico y espiritual. Presenta a Jesús como el Eterno Hijo de Dios y el Verbo encarnado. Destaca los 7 "Yo Soy" y que creer en Él es la única vía para tener vida eterna.' },

    // Historical NT
    { id: 'NT_05', name: 'Hechos', testament: 'New', group: 'HISTORICAL_NT', canonicalOrder: 44, chronologicalOrder: 47, chapters: 28, author: 'Lucas', summary: 'Narra la llegada del Espíritu Santo en Pentecostés y el nacimiento explosivo de la Iglesia. Sigue el ministerio de Pedro y los viajes misioneros de Pablo llevando el evangelio a los gentiles.' },

    // Pauline Epistles
    { id: 'NT_06', name: 'Romanos', testament: 'New', group: 'PAULINE_EPISTLES', canonicalOrder: 45, chronologicalOrder: 56, chapters: 16, author: 'Pablo', summary: 'La obra maestra teológica de Pablo. Explica detalladamente el plan de salvación: la culpa universal del hombre, la justificación por la fe en Cristo y la vida en el Espíritu.' },
    { id: 'NT_07', name: '1 Corintios', testament: 'New', group: 'PAULINE_EPISTLES', canonicalOrder: 46, chronologicalOrder: 54, chapters: 16, author: 'Pablo', summary: 'Carta correctiva a una iglesia problemática. Aborda divisiones, inmoralidad sexual, demandas legales, el matrimonio, los dones espirituales y defiende la realidad de la resurrección.' },
    { id: 'NT_08', name: '2 Corintios', testament: 'New', group: 'PAULINE_EPISTLES', canonicalOrder: 47, chronologicalOrder: 55, chapters: 13, author: 'Pablo', summary: 'La carta más personal de Pablo. Defiende su autoridad apostólica contra falsos maestros, habla del consuelo en la tribulación y explica la naturaleza del ministerio del Nuevo Pacto.' },
    { id: 'NT_09', name: 'Gálatas', testament: 'New', group: 'PAULINE_EPISTLES', canonicalOrder: 48, chronologicalOrder: 48, chapters: 6, author: 'Pablo', summary: 'Una defensa apasionada de la libertad en Cristo contra el legalismo. Enseña que la salvación es solo por gracia, no por obras de la ley, y describe el fruto del Espíritu.' },
    { id: 'NT_10', name: 'Efesios', testament: 'New', group: 'PAULINE_EPISTLES', canonicalOrder: 49, chronologicalOrder: 60, chapters: 6, author: 'Pablo', summary: 'Explica la gran riqueza que tenemos en Cristo y el misterio de la Iglesia como el Cuerpo de Cristo. Llama a andar en unidad y describe la Armadura de Dios para la batalla espiritual.' },
    { id: 'NT_11', name: 'Filipenses', testament: 'New', group: 'PAULINE_EPISTLES', canonicalOrder: 50, chronologicalOrder: 61, chapters: 4, author: 'Pablo', summary: 'La carta del gozo. Escrita desde la prisión, Pablo agradece a los filipenses por su apoyo y les anima a regocijarse siempre, siguiendo el ejemplo de humildad de Cristo.' },
    { id: 'NT_12', name: 'Colosenses', testament: 'New', group: 'PAULINE_EPISTLES', canonicalOrder: 51, chronologicalOrder: 62, chapters: 4, author: 'Pablo', summary: 'Exalta la supremacía y suficiencia de Cristo sobre toda filosofía y poder. Enseña que en Él habita toda la plenitud de la Deidad y que estamos completos en Él.' },
    { id: 'NT_13', name: '1 Tesalonicenses', testament: 'New', group: 'PAULINE_EPISTLES', canonicalOrder: 52, chronologicalOrder: 50, chapters: 5, author: 'Pablo', summary: 'Elogia la fe de una iglesia joven y aclara dudas sobre el regreso de Cristo (el Arrebatamiento). Anima a vivir en santidad y esperanza mientras esperan su venida.' },
    { id: 'NT_14', name: '2 Tesalonicenses', testament: 'New', group: 'PAULINE_EPISTLES', canonicalOrder: 53, chronologicalOrder: 51, chapters: 3, author: 'Pablo', summary: 'Corrige malentendidos sobre el "Día del Señor", explicando que deben suceder ciertos eventos antes (la apostasía y el hombre de pecado). Exhorta a no dejar de trabajar.' },
    
    // Pastoral Epistles (Subset of Pauline)
    { id: 'NT_15', name: '1 Timoteo', testament: 'New', group: 'PAULINE_EPISTLES', canonicalOrder: 54, chronologicalOrder: 63, chapters: 6, author: 'Pablo', summary: 'Instrucciones pastorales a un joven líder. Trata sobre la sana doctrina, la adoración pública, y los requisitos para ancianos y diáconos ("que sepa cómo conducirse en la casa de Dios").' },
    { id: 'NT_16', name: '2 Timoteo', testament: 'New', group: 'PAULINE_EPISTLES', canonicalOrder: 55, chronologicalOrder: 66, chapters: 4, author: 'Pablo', summary: 'El "testamento" final de Pablo antes de su ejecución. Anima a Timoteo a no avergonzarse del evangelio, a predicar la Palabra y a pelear la buena batalla de la fe.' },
    { id: 'NT_17', name: 'Tito', testament: 'New', group: 'PAULINE_EPISTLES', canonicalOrder: 56, chronologicalOrder: 64, chapters: 3, author: 'Pablo', summary: 'Instrucciones a Tito para poner en orden las iglesias en Creta. Enfatiza la necesidad de líderes piadosos y cómo la gracia de Dios nos enseña a vivir sobria y justamente.' },
    { id: 'NT_18', name: 'Filemón', testament: 'New', group: 'PAULINE_EPISTLES', canonicalOrder: 57, chronologicalOrder: 59, chapters: 1, author: 'Pablo', summary: 'Una carta personal pidiendo a Filemón que perdone y reciba a Onésimo, su esclavo fugitivo que se convirtió al cristianismo, no ya como esclavo sino como hermano amado.' },

    // General Epistles
    { id: 'NT_19', name: 'Hebreos', testament: 'New', group: 'GENERAL_EPISTLES', canonicalOrder: 58, chronologicalOrder: 67, chapters: 13, author: 'Desconocido', summary: 'Escrito a cristianos judíos tentados a volver a la ley. Demuestra que Cristo es superior a los ángeles, a Moisés y a los sacrificios antiguos. Él es el Sumo Sacerdote perfecto.' },
    { id: 'NT_20', name: 'Santiago', testament: 'New', group: 'GENERAL_EPISTLES', canonicalOrder: 59, chronologicalOrder: 45, chapters: 5, author: 'Santiago', summary: 'Un manual práctico de vida cristiana. Enfatiza que la fe genuina debe demostrarse con obras. Trata temas como las pruebas, el uso de la lengua y el peligro de las riquezas.' },
    { id: 'NT_21', name: '1 Pedro', testament: 'New', group: 'GENERAL_EPISTLES', canonicalOrder: 60, chronologicalOrder: 64, chapters: 5, author: 'Pedro', summary: 'Escrita para alentar a cristianos perseguidos. Les recuerda su "esperanza viva" y les llama a vivir en santidad y sumisión, siguiendo el ejemplo de sufrimiento de Cristo.' },
    { id: 'NT_22', name: '2 Pedro', testament: 'New', group: 'GENERAL_EPISTLES', canonicalOrder: 61, chronologicalOrder: 65, chapters: 3, author: 'Pedro', summary: 'Advierte contra los falsos maestros dentro de la iglesia y los burladores que niegan la segunda venida. Exhorta a crecer en la gracia y el conocimiento de Jesucristo.' },
    { id: 'NT_23', name: '1 Juan', testament: 'New', group: 'GENERAL_EPISTLES', canonicalOrder: 62, chronologicalOrder: 90, chapters: 5, author: 'Juan', summary: 'Escrita para dar seguridad de salvación. Presenta pruebas de la verdadera fe: obediencia a los mandamientos, amor por los hermanos y creencia en la verdad sobre Jesús.' },
    { id: 'NT_24', name: '2 Juan', testament: 'New', group: 'GENERAL_EPISTLES', canonicalOrder: 63, chronologicalOrder: 91, chapters: 1, author: 'Juan', summary: 'Carta breve a una "señora elegida". Advierte contra mostrar hospitalidad a falsos maestros que no traen la doctrina de Cristo, enfatizando el equilibrio entre verdad y amor.' },
    { id: 'NT_25', name: '3 Juan', testament: 'New', group: 'GENERAL_EPISTLES', canonicalOrder: 64, chronologicalOrder: 92, chapters: 1, author: 'Juan', summary: 'Carta personal a Gayo, elogiando su hospitalidad hacia los predicadores itinerantes. Contrasta su buen ejemplo con la conducta arrogante y dictatorial de Diótrefes.' },
    { id: 'NT_26', name: 'Judas', testament: 'New', group: 'GENERAL_EPISTLES', canonicalOrder: 65, chronologicalOrder: 68, chapters: 1, author: 'Judas', summary: 'Un llamado urgente a "contender ardientemente por la fe". Advierte sobre apóstatas inmorales que se han infiltrado en la iglesia y anuncia el juicio seguro de Dios sobre ellos.' },
    
    // Prophetic NT
    { id: 'NT_27', name: 'Apocalipsis', testament: 'New', group: 'PROPHETIC_NT', canonicalOrder: 66, chronologicalOrder: 95, chapters: 22, author: 'Juan', summary: 'La revelación de Jesucristo sobre el fin de los tiempos. A través de visiones majestuosas, muestra el triunfo final de Cristo sobre Satanás, el juicio final y la gloria de la Nueva Jerusalén.' },
];

export const TRIVIA_SOURCE_DATA: SourceDataItem[] = [
  // ==========================================
  // CATEGORÍA: PROMISAS (PRO) - 50 ÍTEMS
  // ==========================================
  { id: 'PRO_01', text: "Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.", correctAnswer: "Juan 3:16", category: TriviaCategory.PROMISES },
  { id: 'PRO_02', text: "Mira que te mando que te esfuerces y seas valiente; no temas ni desmayes, porque Jehová tu Dios estará contigo en dondequiera que vayas.", correctAnswer: "Josué 1:9", category: TriviaCategory.PROMISES },
  { id: 'PRO_03', text: "Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.", correctAnswer: "Romanos 8:28", category: TriviaCategory.PROMISES },
  { id: 'PRO_04', text: "Clama a mí, y yo te responderé, y te enseñaré cosas grandes y ocultas que tú no conoces.", correctAnswer: "Jeremías 33:3", category: TriviaCategory.PROMISES },
  { id: 'PRO_05', text: "Todo lo puedo en Cristo que me fortalece.", correctAnswer: "Filipenses 4:13", category: TriviaCategory.PROMISES },
  { id: 'PRO_06', text: "Mas buscad primeramente el reino de Dios y su justicia, y todas estas cosas os serán añadidas.", correctAnswer: "Mateo 6:33", category: TriviaCategory.PROMISES },
  { id: 'PRO_07', text: "No temas, porque yo estoy contigo; no desmayes, porque yo soy tu Dios que te esfuerzo; siempre te ayudaré, siempre te sustentaré con la diestra de mi justicia.", correctAnswer: "Isaías 41:10", category: TriviaCategory.PROMISES },
  { id: 'PRO_08', text: "Jehová es mi pastor; nada me faltará.", correctAnswer: "Salmos 23:1", category: TriviaCategory.PROMISES },
  { id: 'PRO_09', text: "Porque yo sé los pensamientos que tengo acerca de vosotros, dice Jehová, pensamientos de paz, y no de mal, para daros el fin que esperáis.", correctAnswer: "Jeremías 29:11", category: TriviaCategory.PROMISES },
  { id: 'PRO_10', text: "Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús.", correctAnswer: "Filipenses 4:19", category: TriviaCategory.PROMISES },
  { id: 'PRO_11', text: "Si confesamos nuestros pecados, él es fiel y justo para perdonar nuestros pecados, y limpiarnos de toda maldad.", correctAnswer: "1 Juan 1:9", category: TriviaCategory.PROMISES },
  { id: 'PRO_12', text: "Pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.", correctAnswer: "Isaías 40:31", category: TriviaCategory.PROMISES },
  { id: 'PRO_13', text: "El ángel de Jehová acampa alrededor de los que le temen, Y los defiende.", correctAnswer: "Salmos 34:7", category: TriviaCategory.PROMISES },
  { id: 'PRO_14', text: "Cree en el Señor Jesucristo, y serás salvo, tú y tu casa.", correctAnswer: "Hechos 16:31", category: TriviaCategory.PROMISES },
  { id: 'PRO_15', text: "Echando toda vuestra ansiedad sobre él, porque él tiene cuidado de vosotros.", correctAnswer: "1 Pedro 5:7", category: TriviaCategory.PROMISES },
  { id: 'PRO_16', text: "Deléitate asimismo en Jehová, Y él te concederá las peticiones de tu corazón.", correctAnswer: "Salmos 37:4", category: TriviaCategory.PROMISES },
  { id: 'PRO_17', text: "Tú guardarás en completa paz a aquel cuyo pensamiento en ti persevera; porque en ti ha confiado.", correctAnswer: "Isaías 26:3", category: TriviaCategory.PROMISES },
  { id: 'PRO_18', text: "De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron; he aquí todas son hechas nuevas.", correctAnswer: "2 Corintios 5:17", category: TriviaCategory.PROMISES },
  { id: 'PRO_19', text: "Y esta es la promesa que él nos hizo, la vida eterna.", correctAnswer: "1 Juan 2:25", category: TriviaCategory.PROMISES },
  { id: 'PRO_20', text: "Por la misericordia de Jehová no hemos sido consumidos, porque nunca decayeron sus misericordias. Nuevas son cada mañana; grande es tu fidelidad.", correctAnswer: "Lamentaciones 3:22-23", category: TriviaCategory.PROMISES },
  { id: 'PRO_21', text: "Jehová peleará por vosotros, y vosotros estaréis tranquilos.", correctAnswer: "Éxodo 14:14", category: TriviaCategory.PROMISES },
  { id: 'PRO_22', text: "Porque el Señor mismo con voz de mando, con voz de arcángel, y con trompeta de Dios, descenderá del cielo; y los muertos en Cristo resucitarán primero.", correctAnswer: "1 Tesalonicenses 4:16", category: TriviaCategory.PROMISES },
  { id: 'PRO_23', text: "Yo te instruiré y te enseñaré el camino que debes seguir; te aconsejaré y pondré mis ojos en ti.", correctAnswer: "Salmos 32:8", category: TriviaCategory.PROMISES },
  { id: 'PRO_24', text: "Enjugará Dios toda lágrima de los ojos de ellos; y ya no habrá muerte, ni habrá más llanto, ni clamor, ni dolor; porque las primeras cosas pasaron.", correctAnswer: "Apocalipsis 21:4", category: TriviaCategory.PROMISES },
  { id: 'PRO_25', text: "Jehová te guardará de todo mal; Él guardará tu alma.", correctAnswer: "Salmos 121:7", category: TriviaCategory.PROMISES },
  { id: 'PRO_26', text: "Porque la paga del pecado es muerte, mas la dádiva de Dios es vida eterna en Cristo Jesús Señor nuestro.", correctAnswer: "Romanos 6:23", category: TriviaCategory.PROMISES },
  { id: 'PRO_27', text: "Cuando pases por las aguas, yo estaré contigo; y si por los ríos, no te anegarán. Cuando pases por el fuego, no te quemarás, ni la llama arderá en ti.", correctAnswer: "Isaías 43:2", category: TriviaCategory.PROMISES },
  { id: 'PRO_28', text: "El que habita al abrigo del Altísimo Morará bajo la sombra del Omnipotente.", correctAnswer: "Salmos 91:1", category: TriviaCategory.PROMISES },
  { id: 'PRO_29', text: "No te dejaré, ni te desampararé.", correctAnswer: "Hebreos 13:5", category: TriviaCategory.PROMISES },
  { id: 'PRO_30', text: "Acerquémonos, pues, confiadamente al trono de la gracia, para alcanzar misericordia y hallar gracia para el oportuno socorro.", correctAnswer: "Hebreos 4:16", category: TriviaCategory.PROMISES },
  { id: 'PRO_31', text: "Mas a todos los que le recibieron, a los que creen en su nombre, les dio potestad de ser hechos hijos de Dios.", correctAnswer: "Juan 1:12", category: TriviaCategory.PROMISES },
  { id: 'PRO_32', text: "Si alguno de vosotros tiene falta de sabiduría, pídala a Dios, el cual da a todos abundantemente y sin reproche, y le será dada.", correctAnswer: "Santiago 1:5", category: TriviaCategory.PROMISES },
  { id: 'PRO_33', text: "Jehová es bueno, fortaleza en el día de la angustia; y conoce a los que en él confían.", correctAnswer: "Nahúm 1:7", category: TriviaCategory.PROMISES },
  { id: 'PRO_34', text: "Y el Dios de paz aplastará en breve a Satanás bajo vuestros pies.", correctAnswer: "Romanos 16:20", category: TriviaCategory.PROMISES },
  { id: 'PRO_35', text: "El que comenzó en vosotros la buena obra, la perfeccionará hasta el día de Jesucristo.", correctAnswer: "Filipenses 1:6", category: TriviaCategory.PROMISES },
  { id: 'PRO_36', text: "Jehová está en medio de ti, poderoso, él salvará; se gozará sobre ti con alegría, callará de amor, se regocijará sobre ti con cánticos.", correctAnswer: "Sofonías 3:17", category: TriviaCategory.PROMISES },
  { id: 'PRO_37', text: "Fiel es el que os llama, el cual también lo hará.", correctAnswer: "1 Tesalonicenses 5:24", category: TriviaCategory.PROMISES },
  { id: 'PRO_38', text: "Cercano está Jehová a los quebrantados de corazón; Y salva a los contritos de espíritu.", correctAnswer: "Salmos 34:18", category: TriviaCategory.PROMISES },
  { id: 'PRO_39', text: "Yo, yo soy el que borro tus rebeliones por amor de mí mismo, y no me acordaré de tus pecados.", correctAnswer: "Isaías 43:25", category: TriviaCategory.PROMISES },
  { id: 'PRO_40', text: "Porque no nos ha dado Dios espíritu de cobardía, sino de poder, de amor y de dominio propio.", correctAnswer: "2 Timoteo 1:7", category: TriviaCategory.PROMISES },
  { id: 'PRO_41', text: "Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.", correctAnswer: "Filipenses 4:7", category: TriviaCategory.PROMISES },
  { id: 'PRO_42', text: "Aunque ande en valle de sombra de muerte, No temeré mal alguno, porque tú estarás conmigo; Tu vara y tu cayado me infundirán aliento.", correctAnswer: "Salmos 23:4", category: TriviaCategory.PROMISES },
  { id: 'PRO_43', text: "El Señor es mi luz y mi salvación; ¿de quién temeré? El Señor es la fortaleza de mi vida; ¿de quién he de atemorizarme?", correctAnswer: "Salmos 27:1", category: TriviaCategory.PROMISES },
  { id: 'PRO_44', text: "Y yo les doy vida eterna; y no perecerán jamás, ni nadie las arrebatará de mi mano.", correctAnswer: "Juan 10:28", category: TriviaCategory.PROMISES },
  { id: 'PRO_45', text: "Si Dios es por nosotros, ¿quién contra nosotros?", correctAnswer: "Romanos 8:31", category: TriviaCategory.PROMISES },
  { id: 'PRO_46', text: "Por tanto, no desmayamos; antes aunque este nuestro hombre exterior se va desgastando, el interior no obstante se renueva de día en día.", correctAnswer: "2 Corintios 4:16", category: TriviaCategory.PROMISES },
  { id: 'PRO_47', text: "Someteos, pues, a Dios; resistid al diablo, y huirá de vosotros.", correctAnswer: "Santiago 4:7", category: TriviaCategory.PROMISES },
  { id: 'PRO_48', text: "Bienaventurado el varón que soporta la tentación; porque cuando haya resistido la prueba, recibirá la corona de vida.", correctAnswer: "Santiago 1:12", category: TriviaCategory.PROMISES },
  { id: 'PRO_49', text: "Os daré corazón nuevo, y pondré espíritu nuevo dentro de vosotros.", correctAnswer: "Ezequiel 36:26", category: TriviaCategory.PROMISES },
  { id: 'PRO_50', text: "Con amor eterno te he amado; por tanto, te prolongué mi misericordia.", correctAnswer: "Jeremías 31:3", category: TriviaCategory.PROMISES },

  // ==========================================
  // CATEGORÍA: COMMANDMENTS (CMD) - 50 ÍTEMS
  // ==========================================
  { id: 'CMD_01', text: "Honra a tu padre y a tu madre, para que tus días se alarguen en la tierra que Jehová tu Dios te da.", correctAnswer: "Éxodo 20:12", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_02', text: "No tendrás dioses ajenos delante de mí.", correctAnswer: "Éxodo 20:3", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_03', text: "Amarás al Señor tu Dios con todo tu corazón, y con toda tu alma, y con toda tu mente.", correctAnswer: "Mateo 22:37", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_04', text: "Un mandamiento nuevo os doy: Que os améis unos a otros; como yo os he amado, que también os améis unos a otros.", correctAnswer: "Juan 13:34", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_05', text: "No te harás imagen, ni ninguna semejanza de lo que esté arriba en el cielo, ni abajo en la tierra, ni en las aguas debajo de la tierra.", correctAnswer: "Éxodo 20:4", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_06', text: "No tomarás el nombre de Jehová tu Dios en vano; porque no dará por inocente Jehová al que tomare su nombre en vano.", correctAnswer: "Éxodo 20:7", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_07', text: "Acuérdate del día de reposo para santificarlo.", correctAnswer: "Éxodo 20:8", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_08', text: "No matarás.", correctAnswer: "Éxodo 20:13", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_09', text: "No cometerás adulterio.", correctAnswer: "Éxodo 20:14", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_10', text: "No hurtarás.", correctAnswer: "Éxodo 20:15", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_11', text: "No hablarás contra tu prójimo falso testimonio.", correctAnswer: "Éxodo 20:16", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_12', text: "No codiciarás la casa de tu prójimo, no codiciarás la mujer de tu prójimo, ni su siervo, ni su criada, ni su buey, ni su asno, ni cosa alguna de tu prójimo.", correctAnswer: "Éxodo 20:17", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_13', text: "Amarás a tu prójimo como a ti mismo.", correctAnswer: "Mateo 22:39", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_14', text: "Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo.", correctAnswer: "Mateo 28:19", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_15', text: "Estad siempre gozosos.", correctAnswer: "1 Tesalonicenses 5:16", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_16', text: "Orad sin cesar.", correctAnswer: "1 Tesalonicenses 5:17", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_17', text: "Dad gracias en todo, porque esta es la voluntad de Dios para con vosotros en Cristo Jesús.", correctAnswer: "1 Tesalonicenses 5:18", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_18', text: "Fíate de Jehová de todo tu corazón, Y no te apoyes en tu propia prudencia.", correctAnswer: "Proverbios 3:5", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_19', text: "Reconócelo en todos tus caminos, Y él enderezará tus veredas.", correctAnswer: "Proverbios 3:6", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_20', text: "Hijos, obedeced en el Señor a vuestros padres, porque esto es justo.", correctAnswer: "Efesios 6:1", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_21', text: "Antes sed benignos unos con otros, misericordiosos, perdonándoos unos a otros, como Dios también os perdonó a vosotros en Cristo.", correctAnswer: "Efesios 4:32", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_22', text: "No os conforméis a este siglo, sino transformaos por medio de la renovación de vuestro entendimiento.", correctAnswer: "Romanos 12:2", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_23', text: "Bendecid a los que os persiguen; bendecid, y no maldigáis.", correctAnswer: "Romanos 12:14", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_24', text: "Vestíos, pues, como escogidos de Dios, santos y amados, de entrañable misericordia, de benignidad, de humildad, de mansedumbre, de paciencia.", correctAnswer: "Colosenses 3:12", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_25', text: "Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.", correctAnswer: "Colosenses 3:23", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_26', text: "Pero sed hacedores de la palabra, y no tan solamente oidores, engañándoos a vosotros mismos.", correctAnswer: "Santiago 1:22", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_27', text: "Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.", correctAnswer: "Filipenses 4:6", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_28', text: "Guarda tu lengua del mal, Y tus labios de hablar engaño.", correctAnswer: "Salmos 34:13", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_29', text: "No juzguéis, para que no seáis juzgados.", correctAnswer: "Mateo 7:1", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_30', text: "Sobre toda cosa guardada, guarda tu corazón; Porque de él mana la vida.", correctAnswer: "Proverbios 4:23", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_31', text: "Amados, amémonos unos a otros; porque el amor es de Dios. Todo aquel que ama, es nacido de Dios, y conoce a Dios.", correctAnswer: "1 Juan 4:7", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_32', text: "Instruye al niño en su camino, Y aun cuando fuere viejo no se apartará de él.", correctAnswer: "Proverbios 22:6", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_33', text: "No os embriaguéis con vino, en lo cual hay disolución; antes bien sed llenos del Espíritu.", correctAnswer: "Efesios 5:18", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_34', text: "Soportaos unos a otros, y perdonaos unos a otros si alguno tuviere queja contra otro. De la manera que Cristo os perdonó, así también hacedlo vosotros.", correctAnswer: "Colosenses 3:13", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_35', text: "No debáis a nadie nada, sino el amaros unos a otros; porque el que ama al prójimo, ha cumplido la ley.", correctAnswer: "Romanos 13:8", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_36', text: "No seas vencido de lo malo, sino vence con el bien el mal.", correctAnswer: "Romanos 12:21", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_37', text: "Maridos, amad a vuestras mujeres, así como Cristo amó a la iglesia, y se entregó a sí mismo por ella.", correctAnswer: "Efesios 5:25", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_38', text: "Padres, no provoquéis a ira a vuestros hijos, sino criadlos en disciplina y amonestación del Señor.", correctAnswer: "Efesios 6:4", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_39', text: "Haced todo sin murmuraciones y contiendas.", correctAnswer: "Filipenses 2:14", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_40', text: "Buscad a Jehová y su poder; Buscad su rostro continuamente.", correctAnswer: "1 Crónicas 16:11", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_41', text: "Amad, pues, a vuestros enemigos, y haced bien, y prestad, no esperando de ello nada; y será vuestro galardón grande.", correctAnswer: "Lucas 6:35", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_42', text: "Examinadlo todo; retened lo bueno.", correctAnswer: "1 Tesalonicenses 5:21", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_43', text: "Por tanto, confesaos vuestros pecados unos a otros, y orad unos por otros, para que seáis sanados.", correctAnswer: "Santiago 5:16", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_44', text: "Someteos unos a otros en el temor de Dios.", correctAnswer: "Efesios 5:21", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_45', text: "Presentad vuestros cuerpos en sacrificio vivo, santo, agradable a Dios, que es vuestro culto racional.", correctAnswer: "Romanos 12:1", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_46', text: "Gozaos con los que se gozan; llorad con los que lloran.", correctAnswer: "Romanos 12:15", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_47', text: "Andad en el Espíritu, y no satisfagáis los deseos de la carne.", correctAnswer: "Gálatas 5:16", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_48', text: "Vestíos de toda la armadura de Dios, para que podáis estar firmes contra las asechanzas del diablo.", correctAnswer: "Efesios 6:11", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_49', text: "No améis al mundo, ni las cosas que están en el mundo.", correctAnswer: "1 Juan 2:15", category: TriviaCategory.COMMANDMENTS },
  { id: 'CMD_50', text: "Sobrellevad los unos las cargas de los otros, y cumplid así la ley de Cristo.", correctAnswer: "Gálatas 6:2", category: TriviaCategory.COMMANDMENTS },

  // ==========================================
  // CATEGORÍA: JESUS SAID (JS) - 50 ÍTEMS
  // ==========================================
  { id: 'JS_01', text: "Yo soy el camino, y la verdad, y la vida; nadie viene al Padre, sino por mí.", correctAnswer: "Juan 14:6", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_02', text: "Yo soy la luz del mundo; el que me sigue, no andará en tinieblas, sino que tendrá la luz de la vida.", correctAnswer: "Juan 8:12", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_03', text: "Dejad a los niños venir a mí, y no se lo impidáis; porque de los tales es el reino de los cielos.", correctAnswer: "Mateo 19:14", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_04', text: "Bienaventurados los pobres en espíritu, porque de ellos es el reino de los cielos.", correctAnswer: "Mateo 5:3", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_05', text: "La paz os dejo, mi paz os doy; yo no os la doy como el mundo la da. No se turbe vuestro corazón, ni tenga miedo.", correctAnswer: "Juan 14:27", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_06', text: "Venid a mí todos los que estáis trabajados y cargados, y yo os haré descansar.", correctAnswer: "Mateo 11:28", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_07', text: "Yo soy la resurrección y la vida; el que cree en mí, aunque esté muerto, vivirá.", correctAnswer: "Juan 11:25", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_08', text: "Vosotros sois la sal de la tierra; pero si la sal se desvaneciere, ¿con qué será salada?", correctAnswer: "Mateo 5:13", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_09', text: "Vosotros sois la luz del mundo; una ciudad asentada sobre un monte no se puede esconder.", correctAnswer: "Mateo 5:14", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_10', text: "No sólo de pan vivirá el hombre, sino de toda palabra que sale de la boca de Dios.", correctAnswer: "Mateo 4:4", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_11', text: "Yo soy el pan de vida; el que a mí viene, nunca tendrá hambre; y el que en mí cree, no tendrá sed jamás.", correctAnswer: "Juan 6:35", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_12', text: "Yo soy el buen pastor; el buen pastor su vida da por las ovejas.", correctAnswer: "Juan 10:11", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_13', text: "Yo soy la vid, vosotros los pámpanos; el que permanece en mí, y yo en él, éste lleva mucho fruto; porque separados de mí nada podéis hacer.", correctAnswer: "Juan 15:5", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_14', text: "Pedid, y se os dará; buscad, y hallaréis; llamad, y se os abrirá.", correctAnswer: "Mateo 7:7", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_15', text: "Así que, todas las cosas que queráis que los hombres hagan con vosotros, así también haced vosotros con ellos.", correctAnswer: "Mateo 7:12", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_16', text: "Si alguno quiere venir en pos de mí, niéguese a sí mismo, tome su cruz cada día, y sígame.", correctAnswer: "Lucas 9:23", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_17', text: "Porque el Hijo del Hombre vino a buscar y a salvar lo que se había perdido.", correctAnswer: "Lucas 19:10", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_18', text: "De cierto, de cierto te digo, que el que no naciere de nuevo, no puede ver el reino de Dios.", correctAnswer: "Juan 3:3", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_19', text: "El cielo y la tierra pasarán, pero mis palabras no pasarán.", correctAnswer: "Mateo 24:35", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_20', text: "Por tanto os digo: No os afanéis por vuestra vida, qué habéis de comer o qué habéis de beber; ni por vuestro cuerpo, qué habéis de vestir.", correctAnswer: "Mateo 6:25", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_21', text: "Porque donde están dos o tres congregados en mi nombre, allí estoy yo en medio de ellos.", correctAnswer: "Mateo 18:20", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_22', text: "Y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo. Amén.", correctAnswer: "Mateo 28:20", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_23', text: "Llevad mi yugo sobre vosotros, y aprended de mí, que soy manso y humilde de corazón; y hallaréis descanso para vuestras almas.", correctAnswer: "Mateo 11:29", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_24', text: "Porque mi yugo es fácil, y ligera mi carga.", correctAnswer: "Mateo 11:30", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_25', text: "Al que a mí viene, no le echo fuera.", correctAnswer: "Juan 6:37", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_26', text: "Conoceréis la verdad, y la verdad os hará libres.", correctAnswer: "Juan 8:32", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_27', text: "El ladrón no viene sino para hurtar y matar y destruir; yo he venido para que tengan vida, y para que la tengan en abundancia.", correctAnswer: "Juan 10:10", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_28', text: "Mis ovejas oyen mi voz, y yo las conozco, y me siguen.", correctAnswer: "Juan 10:27", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_29', text: "En el mundo tendréis aflicción; pero confiad, yo he vencido al mundo.", correctAnswer: "Juan 16:33", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_30', text: "Id por todo el mundo y predicad el evangelio a toda criatura.", correctAnswer: "Marcos 16:15", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_31', text: "Nadie tiene mayor amor que este, que uno ponga su vida por sus amigos.", correctAnswer: "Juan 15:13", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_32', text: "Dad, y se os dará; medida buena, apretada, remecida y rebosando darán en vuestro regazo.", correctAnswer: "Lucas 6:38", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_33', text: "No te digo hasta siete, sino aun hasta setenta veces siete.", correctAnswer: "Mateo 18:22", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_34', text: "Velad y orad, para que no entréis en tentación; el espíritu a la verdad está dispuesto, pero la carne es débil.", correctAnswer: "Mateo 26:41", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_35', text: "Porque de la abundancia del corazón habla la boca.", correctAnswer: "Mateo 12:34", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_36', text: "Pero recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo, y me seréis testigos.", correctAnswer: "Hechos 1:8", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_37', text: "Si me amáis, guardad mis mandamientos.", correctAnswer: "Juan 14:15", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_38', text: "Vosotros sois mis amigos, si hacéis lo que yo os mando.", correctAnswer: "Juan 15:14", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_39', text: "No seáis, pues, como ellos; porque vuestro Padre sabe de qué cosas tenéis necesidad, antes que vosotros le pidáis.", correctAnswer: "Mateo 6:8", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_40', text: "Cualquiera, pues, que me oye estas palabras, y las hace, le compararé a un hombre prudente, que edificó su casa sobre la roca.", correctAnswer: "Mateo 7:24", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_41', text: "Si tuvierais fe como un grano de mostaza, diríais a este sicómoro: Desarráigate, y plántate en el mar; y os obedecería.", correctAnswer: "Lucas 17:6", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_42', text: "El que es fiel en lo muy poco, también en lo más es fiel; y el que en lo muy poco es injusto, también en lo más es injusto.", correctAnswer: "Lucas 16:10", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_43', text: "Padre, perdónalos, porque no saben lo que hacen.", correctAnswer: "Lucas 23:34", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_44', text: "Dios es Espíritu; y los que le adoran, en espíritu y en verdad es necesario que adoren.", correctAnswer: "Juan 4:24", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_45', text: "No os maravilléis de esto; porque vendrá hora cuando todos los que están en los sepulcros oirán su voz.", correctAnswer: "Juan 5:28", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_46', text: "El que come mi carne y bebe mi sangre, tiene vida eterna; y yo le resucitaré en el día postrero.", correctAnswer: "Juan 6:54", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_47', text: "Todo lo que el Padre me da, vendrá a mí; y al que a mí viene, no le echo fuera.", correctAnswer: "Juan 6:37", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_48', text: "El que de vosotros esté sin pecado sea el primero en arrojar la piedra contra ella.", correctAnswer: "Juan 8:7", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_49', text: "Yo soy la puerta; el que por mí entrare, será salvo; y entrará, y saldrá, y hallará pastos.", correctAnswer: "Juan 10:9", category: TriviaCategory.JESUS_SAID },
  { id: 'JS_50', text: "Bienaventurados los que no vieron, y creyeron.", correctAnswer: "Juan 20:29", category: TriviaCategory.JESUS_SAID }
];

export const MINIMUM_SOURCE_DATA_ITEMS_TRIVIA = 4;
export const MINIMUM_PAIRS_MEMORY = 2; 
export const MINIMUM_VERSES_ORDER_VERSE = 1; 
export const MINIMUM_VERSES_RECITE_VERSE = 1; 
export const MINIMUM_BOOKS_SORT = 3;
