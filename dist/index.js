"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const suggestions_1 = __importDefault(require("./routes/suggestions"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const cors_1 = __importDefault(require("cors"));
// Import Swagger UI and YAML parser
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const yaml_1 = __importDefault(require("yaml"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)()); // allow cross-origin requests
app.use(express_1.default.json()); // for future body parsing
// Health check
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});
// Suggestions route
app.use('/suggestions', authMiddleware_1.checkApiKey, suggestions_1.default);
// Swagger UI setup
const openapiPath = path_1.default.join(__dirname, 'docs', 'openapi.yaml');
const openapiDoc = yaml_1.default.parse(fs_1.default.readFileSync(openapiPath, 'utf8'));
app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiDoc));
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
