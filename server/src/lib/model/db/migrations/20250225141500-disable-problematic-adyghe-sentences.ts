export const up = async function (db: any): Promise<any> {
  return db.runSql(`
    UPDATE sentences SET is_used = FALSE WHERE locale_id=(SELECT id from locales WHERE name='ady') AND text in (
      "Адам хьажъум дэджэгу.",
      "Адыгеим ичӏыпӏэ дахэхэр зэзгъэлъгъу сшӏоигъу.",
      "Адыгэмэ аӏо: Унэм зыщыгъасе етӏуанэ цӏыфмэ ахахь.",
      "Ары, чъыгыр лъага.",
      "Ахэмэ ащыщэу Кавказым къыщыкӏырэр лъэпкъ ӏӏ мэхъу.",
      "Ахэр сутудэнтых.",
      "Ащ щхэнэу лъытхъощтыгъэх ыкӏи къекӏолӏагъэхэр ыгъэщхыщтыгъэх.",
      "Бзыу цӀыкӀур иибгъом къибыбыкӀыгъ.",
      "Бэрэтэр Хьамид адыгэ усэкӀо цӀэрыӀомэ ащыщ.",
      "Гъэмафэ къэси нытыхэр тигъусэу тэ хы ӏушӏом тэкӏо.",
      "Джабгъумкӏэ къогъум креслитӏурэ мыинэу журнальнэ столрэ къотых.",
      "Джэмышхымрэ щэжъыемрэ джабгъумкӏэ сэгъэтӏылъы.",
      "Ежьыри ишъыпкъэу тренировкэхэр ешӏых.",
      "Зи умышхэмэ сэкъэпфэгъубжыт!",
      "Зыгом уфая?",
      "Зэрэхабзэу, тэ пщрыхьапӏэм тыщэшхэ.",
      "Илъэси плӏыкӏэ узэкӏэӏэбэжьмэ мы фильмыр тырахынэу агу къэкӏыгъагъ.",
      "Клубыр библиотэкэм гот.",
      "Матэм мэӏэрысэ тӏокӏ илъ.",
      "Мы шажъыер цако, нахь чан уиӏа?",
      "Нан, къэбаскъи бжьыни къэсщэфагъ.",
      "Некӏо чай тешъыст.",
      "Непэ Мыкъуапэ нэбгырэ минишъэрэ тӏокӏищрэ пшӏыкӏуирэм ехъу щэпсэу.",
      "Пшъашъэхэмрэ кӏалэхэмрэ кинэум зэдэкӏуэх.",
      "Пшыпхъу письма фэтх!",
      "Сщы ыцӏэр Тамбий.",
      "Сыд уянэщым ыцӏэр?",
      "Сыд фэдэбза Заур зэригъашӏэрэр?",
      "Сыдигъо ӏукӏыщта мэшӏокуыр?",
      "Сыдо сэпщъыагъ непэ.",
      "Сыхьатыр тхапща?",
      "Сэ мэзаем ипшӏыкӏупшӏым сыкъэхъугъ.",
      "Сятэ ыцэр Къэплъан?",
      "Сятэщыр узынчъэп.",
      "Тимэз баджэхэри, тыгъугъужъхэри, тхьакӏумкӏыхьэхэри хэсых.",
      "Тфымрэ блымрэ язфагу уизвонокы сэкъежыщт.",
      "Тхапщ хъугъэ?",
      "Тырку къэщэгъ.",
      "Тэри тиунагъэокӏэ шъукъетэгъэблагъэ.",
      "Уадыг?",
      "Уи нэбджэгъу уи гъундж.",
      "Хакӏэхэ тиӏэх.",
      "Чъытхатэм кӏэлэеджакӏомэ ӏоф щашӏэ.",
      "Чэщым сыхьат бгъум сэгъолъыжьы.",
      "Шъуихатэ чэрэз чъыг дата?",
      "Шэлэегъаджэм кӏалэхэм тетрадхэр афегощы.",
      "Шэлэегъаджэм кӏэлэеджакӏор регъаджэ.",
      "Классым столи, парти, доски, пхъэнтӏэкӏухэри, шкафи итых.",
      "Мэзым пцэжъыехэр хэсых.",
      "Столыр щкафым гот.",
      "Сыдым о узэгъупщысы?",
      "Сыхьат пшӏыкӏузым щэджагъошхэ ешӏы.",
      "Янахь уикӏасэрэ телевизор програмыр сыда?",
      "Ар унэ ин ышӏыгъ.",
      "Ардэдэм нэфшъагъом дэжь зэхихыгъэ бзыумэ яорэд къэӀукӀэ ыгу къэкӀыжьыгъ.",
      "Километрэ плӏыщрэ тӏокӏитӏурэ.",
      "Любэ классым иыс.",
      "О Мыекъуапэ ущэпсэу?",
      "Столым къэгъагъэхэр тетых.",
      "Столым пкъыгъо зэфэшъхьафхэр тыралъхьэ, сабыир хагъэӀабэ; а къыхихыгъэ пкъыгъом епхыгъэу «сэнэхьат къыхихыщт» аӀо.",
      "Столыр къогъум къот.",
      "Столыр чъыгым чӏэт.",
      "Сэ еджапӏэ гъэцӏэкӏэнхэр сэшӏых.",
      "Сэ тикъалэ дэтэу сымэджэщым сыщэлэжьэ.",
      "Тиуниверситет отделениябэ иӏ.",
      "Унэм щыгъынхэм апае шкаф, стол ыкӏи креслэ итых.",
      "Хъусен ыкъуаджэ дэт еджапӀэр къызеухым, Адыгэ кӀэлэегъэджэ училищэм чӀэхьагъ ыкӀи ар къыухыгъ.",
      "Хьэ цӏыкӏум чэтыум къеджагъ.",
      "Мэшб."
      )
  `)
};

export const down = async function (): Promise<any> {
  return null;
};
