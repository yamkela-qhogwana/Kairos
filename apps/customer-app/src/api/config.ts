// Real devices (phones on the same Wi-Fi/hotspot as this machine) can't reach
// 10.0.2.2 or localhost — that only resolves to the host from inside the
// Android emulator. Point at the dev machine's actual LAN IP instead so both
// the emulator and a real phone can reach the API.
// If this stops connecting, your machine's IP may have changed — check it
// with `ipconfig` (Windows) and update the value below.
export const API_BASE_URL = 'http://172.20.10.3:5080';
