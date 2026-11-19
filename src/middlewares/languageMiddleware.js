const SUPPORTED_LANGUAGES = ["vi", "en"];
const DEFAULT_LANGUAGE = "vi";

const normalizeLang = (rawValue) => {
  if (!rawValue || typeof rawValue !== "string") return null;
  // Lấy phần đầu trước dấu phẩy hoặc gạch ngang, ví dụ: "en-US,en;q=0.9" -> "en"
  const cleaned = rawValue.split(",")[0].trim().split(/[-_]/)[0].toLowerCase();
  return SUPPORTED_LANGUAGES.includes(cleaned) ? cleaned : null;
};

const resolveLanguage = (req, res, next) => {
  // Ưu tiên 1: query ?lang=vi hoặc ?lang=en
  // Ưu tiên 2: header Accept-Language
  // Mặc định: "vi"
  const fromQuery = normalizeLang(req.query?.lang);
  const fromHeader = normalizeLang(req.headers["accept-language"]);

  req.lang = fromQuery || fromHeader || DEFAULT_LANGUAGE;
  res.locals.lang = req.lang;

  // Trả kèm header Content-Language để client biết server đang phản hồi ngôn ngữ nào
  res.setHeader("Content-Language", req.lang);
  next();
};

module.exports = {
  resolveLanguage,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
};
