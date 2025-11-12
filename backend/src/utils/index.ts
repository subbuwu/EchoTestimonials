import crypto from "crypto";

export function generateEmbedKey(prefix: string = "prj_") {
    return prefix + crypto.randomBytes(16).toString("hex");
}

export function generateTestimonialEmbedKey() {
    return "tst_" + crypto.randomBytes(16).toString("hex");
}