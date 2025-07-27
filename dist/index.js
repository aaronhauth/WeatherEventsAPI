"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const suggestions_1 = __importDefault(require("./routes/suggestions"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Health check
app.get('/', (_req, res) => {
    res.send('🌤️ Weather-to-Event API is running!');
});
// Suggestions route
app.use('/suggestions', suggestions_1.default);
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});
