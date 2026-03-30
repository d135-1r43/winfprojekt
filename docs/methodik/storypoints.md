---
sidebar_position: 3
---

# Story Points

Story Points sind eine Einheit zur Schätzung von **Komplexität** — nicht von Zeit. Eine Story mit 5 Punkten ist nicht „5 Stunden Arbeit", sondern relativ zu anderen Stories etwa doppelt so komplex wie eine mit 3 Punkten.

## Fibonacci-Skala

Geschätzt wird nach der Fibonacci-Folge:

**1 — 2 — 3 — 5 — 8 — 13 — 21**

Die wachsenden Abstände sind gewollt: Bei größeren Stories wächst die Unsicherheit, eine Scheingenauigkeit (z. B. „14 statt 13") wäre irreführend. Ist sich das Team unsicher zwischen zwei Werten, wird meistens der höhere gewählt.

| Punkte | Bedeutung |
|--------|-----------|
| **1** | Trivial, kaum Unbekannte |
| **2** | Klein, gut verstanden |
| **3** | Überschaubar, wenige Abhängigkeiten |
| **5** | Mittlere Komplexität, einige Unbekannte |
| **8** | Groß, mehrere Abhängigkeiten oder Unsicherheiten |
| **13** | Sehr groß — sollte in kleinere Stories aufgeteilt werden |
| **21** | Epic — muss aufgeteilt werden, bevor es in einen Sprint kommt |

## Komplexität, nicht Zeit

Story Points messen keine Stunden. Das hat konkrete Gründe:

- **Erfahrung unterscheidet sich:** Dieselbe Aufgabe braucht ein erfahrenes Teammitglied vielleicht zwei Stunden, ein anderes den ganzen Tag. Die Komplexität ist dieselbe.
- **Zeitschätzungen erzeugen Druck:** Wer „3 Stunden" schätzt, steht unter Beobachtung. Wer „3 Punkte" schätzt, beschreibt eine relative Schwierigkeit.
- **Velocity wird stabiler:** Über mehrere Sprints zeigt sich, wie viele Punkte ein Team pro Sprint schafft. Dieser Wert (Velocity) ist ein verlässlicheres Planungswerkzeug als Stundensummen.

## Planning Poker

Die Schätzung erfolgt im **Planning Poker**: Jedes Teammitglied wählt verdeckt eine Karte und alle decken gleichzeitig auf. Bei abweichenden Schätzungen erklären die Ausreißer kurz ihre Sichtweise — oft zeigen sich dabei unterschiedliche Annahmen oder übersehene Abhängigkeiten. Dann wird erneut geschätzt. Ziel ist Konsens, nicht Mehrheitsvotum.
