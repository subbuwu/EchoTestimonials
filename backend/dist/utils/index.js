"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbedKey = generateEmbedKey;
exports.generateTestimonialEmbedKey = generateTestimonialEmbedKey;
const crypto_1 = __importDefault(require("crypto"));
function generateEmbedKey(prefix = "prj_") {
    return prefix + crypto_1.default.randomBytes(16).toString("hex");
}
function generateTestimonialEmbedKey() {
    return "tst_" + crypto_1.default.randomBytes(16).toString("hex");
}
