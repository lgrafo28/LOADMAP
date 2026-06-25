# LoadMap Subagent-Team

Vier scoped Subagents für die Neuroway LoadMap. Projekt-Scope (`.claude/agents/`), also
in Git eingecheckt und teamweit nutzbar. Bei Direkt-Edit auf Platte: Claude-Code-Session
neu starten, damit die Agents geladen werden (über `/agents` erstellte Agents greifen sofort).

## Die Rollen

| Agent | Modell | Tools | Datei-Hoheit |
|---|---|---|---|
| `loadmap-engine` | sonnet | Read, Edit, Write, Bash, Grep, Glob | `lib/`, `data/` (Struktur+Scores), `types/`, `tests/` |
| `loadmap-frontend` | sonnet | Read, Edit, Write, Bash, Grep, Glob | `app/`, `components/`, `tailwind.config.ts`, `globals.css` |
| `ux-writer` | sonnet | Read, Edit, Grep, Glob | nur Copy-Strings + `layout.tsx`-Metadaten |
| `ui-quality-reviewer` | sonnet | Read, Grep, Glob (read-only) | nichts — nur Analyse |

Datei-Hoheiten überschneiden sich bewusst **nicht** → zwei Agents können parallel laufen,
ohne sich zu überschreiben. Die einzige Grauzone ist `data/loadmap-data.ts` (Engine besitzt
Struktur/Scores, ux-writer nur Stringwerte). Sauberste Lösung: Copy nach
`data/loadmap-copy.ts` extrahieren — dann gehört diese Datei allein dem ux-writer.

## Pipeline (so spielen sie zusammen)

```
1. engine + frontend  →  parallel implementieren (kollisionsfrei dank Datei-Hoheit)
2. ux-writer          →  Copy/Metadaten nachziehen
3. ui-quality-reviewer →  read-only Gate VOR jedem Commit
4. Findings des Reviewers → zurück an engine/frontend zum Fixen
```

Explizit delegieren z. B. so:
`Use the loadmap-engine subagent to constrain focusRegion to the selected regions and add a test.`

## Usage im Blick behalten — die wichtigen Stellschrauben

Subagents kosten dieselben Tokens wie eine normale Session, nur in eigenem Kontext.
Subagent-lastige Workflows können **~7× Tokens** eines Single-Threads verbrauchen. Deshalb:

- **Nicht überspawnen.** Vier reichen. Mehr Agents = mehr parallele Kontextfenster = mehr Verbrauch. Fang mit `ui-quality-reviewer` + einem Implementer an, der Rest nur bei Bedarf.
- **Suche läuft über den eingebauten `Explore`-Agent (Haiku, read-only)** — dafür keinen eigenen Agent bauen. Günstigste Codebase-Suche, hält den Hauptthread schlank.
- **Read-only wo möglich.** Der Reviewer hat nur Read/Grep/Glob — kein Edit/Bash. Billiger, sicherer, keine versehentlichen Änderungen.
- **Knappe Rückgaben erzwungen.** Jeder Agent-Prompt verlangt ≤8–10 Zeilen Summary statt File-Dumps. Das hält den Eltern-Kontext klein (der eigentliche versteckte Kostentreiber).
- **Budget-Decke per Env-Var:** `CLAUDE_CODE_SUBAGENT_MODEL=haiku` zwingt *alle* Subagents auf ein Modell — nützlich, wenn du nah am Rate-Limit bist. Wieder entfernen für volle Qualität.
- **Serielle Reviews.** Reviewer erst laufen lassen, wenn die Implementer fertig sind — nicht parallel mitlaufen lassen.
- **Triviales bleibt im Hauptthread.** Ein Einzeiler-Fix oder eine schnelle Frage rechtfertigt den Startup-Overhead eines Subagents nicht.

## Optionale Erweiterungen (erst bei echtem Bedarf)

- `skills:`-Frontmatter, um z. B. ein Design-Token-Skill direkt in `loadmap-frontend` zu laden (Skills werden NICHT automatisch vererbt).
- `background: true`, um den Reviewer nebenher laufen zu lassen, während du weiterarbeitest.
