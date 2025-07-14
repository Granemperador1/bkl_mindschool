import "@testing-library/jest-dom";

// Polyfill para TextEncoder/TextDecoder en Jest
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
