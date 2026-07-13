# Cardweave — Technology Stack (Proposal)

**Status:** 💡 Proposal — not final, open for discussion
**Author:** Hermes Agent
**Date:** 2026-07-12

---

## Vision

Un auto-battler PvP 2D cu card crafting din părți, performant, frumos și scalabil la milioane de jucători. Fără engine mort, fără runtime inutil.

---

## Client — Jocul

| Componentă | Tehnologie | Alternativa | Motiv |
|---|---|---|---|
| **Limbaj** | Rust | C++, C#, GDScript | Zero GC, zero runtime, control total pe memorie |
| **Rendering** | WebGPU (wgpu) | Vulkan, OpenGL, DirectX | Cross-platform nativ, GPU direct, performanță pură |
| **UI** | egui | Druid, Slint | Instant mode, ușor de integrat, custom style |
| **Animații** | Scrise manual (lerp/tween) | Spine, DragonBones | Pentru card game 2D nu ai nevoie de mai mult |
| **Audio** | Kira | rodio, OpenAL | Audio 3D ușor, low latency |
| **Networking** | Tonic (gRPC) | WebSockets, TCP raw | Performant, tipat, code generation |
| **Asset loading** | Custom (PNG + JSON) | bevy_asset, amethyst | Control total, fără overhead |
| **Physics** | ❌ Nu e necesar | Rapier (dacă ar fi) | Auto-battler nu are coliziuni reale |

---

## Server — PvP, Trading, Matchmaking

| Componentă | Tehnologie | Alternativa | Motiv |
|---|---|---|---|
| **API Server** | Rust + Actix Web | Go, C# (ASP.NET), Node | 1M+ req/s, zero GC, memory safe |
| **Matchmaking** | Rust + Redis Streams | Elixir, Erlang | Partajare în timp real, coadă distribuită |
| **Game State** | Rust (in-memory) | C# (server Unity) | Validare în timp real, zero alocări |
| **Anti-cheat** | Server-authoritative | EAC, BattlEye | Toată logica pe server — tu controlezi |
| **Database** | PostgreSQL | CockroachDB, SQLite | ACID, tranzacții, fiabilitate dovedită |
| **Cache** | Redis | Memcached, Dragonfly | Structuri native, pub/sub, persist |
| **Trading (cards)** | PostgreSQL + HMAC signing | Blockchain | Auditabil, sigur, fără complexitate |
| **Auth** | JWT + OAuth2 (Steam) | Firebase Auth, Auth0 | Steam login direct, 0 intermediari |

---

## Frontend — Site / Dashboard

| Componentă | Tehnologie | Motiv |
|---|---|---|
| **Site** | Next.js + Tailwind | Rapid, SEO-friendly |
| **Dashboard** | React + shadcn/ui | Componente gata, arată bine |
| **Leaderboard** | React + Server-Sent Events | Live update, simplu de implementat |

---

## Grafică

| Ce | Tehnologie | De ce |
|---|---|---|
| **Card backgrounds** | Generative (Stable Diffusion + LoRA) | Stil consistent, mii de variante |
| **Portrete caractere** | AI local (Flux pe VPS) | Zero cost per imagine după setup |
| **Sprite-uri** | Aseprite (CLI) | Export automat, batch processing |
| **UI Mockups** | Figma | Rapid, iterativ |
| **Efecte vizuale** | wgpu compute shaders | GPU direct, zero framerate drop |
| **Particle system** | wgpu custom | 10K particule la 60fps pe un telefon vechi |

---

## Infrastructure

| Strat | Tehnologie | Cost lunar |
|---|---|---|
| **Game server** | 2× VPS (Hetzner) ~4 vCPU, 8GB | ~25€ |
| **Database** | PostgreSQL pe același VPS | Inclus |
| **Cache** | Redis (container) | Inclus |
| **CDN** | Cloudflare (free tier) | 0 |
| **DDoS** | Cloudflare | 0 |
| **CI/CD** | GitHub Actions | 0 |
| **Monitoring** | Grafana + Prometheus | 0 |
| **Backups** | pg_dump → S3 (Backblaze B2) | ~2€ |
| **Total** | | **~30€/lună** |

---

## Ce am evitat

| Tehnologie | Motiv |
|---|---|
| **Unity** | 1GB install, componente moarte, licență, compilare lentă |
| **Unreal** | 30GB install, overkill total pentru un card game 2D |
| **Godot** | Bun engine, dar nu vrei limitări când ai control total în Rust |
| **Blockchain** | Lent, scump, UX horror, overhead inutil |
| **Node.js** | Single-thread, GC imprevizibil, ecosistem fragil |
| **Python** | Prea lent pentru server de joc în timp real |
| **AWS/GCP** | Complex și scump — Hetzner face același lucru la jumătate |

---

## Filosofie

- **Totul în Rust** — același limbaj pe client și server. Zero context switch, zero GC, o singură bază de cod.
- **Server-authoritative** — clientul doar randază. Serverul validează tot.
- **Fără engine** — scrii doar ce folosești. Niciun kilobyte mort.
- **Performanța e feature** — 60fps și pe un telefon vechi. Serverul suportă zeci de mii de jucători cu resurse minimale.

---

**Next:** Discutăm și decidem stack-ul final, apoi începem setup-ul.
