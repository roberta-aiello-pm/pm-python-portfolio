# Git Learn Branching — Reference Summary

> Completato il 21 maggio 2026 | Parte della **Phase 1 - SDLC + Git** del roadmap SDLC+Python (CP-39)
> 
> 🔗 Portfolio: [github.com/roberta-aiello-pm/project-management-portfolio](https://github.com/roberta-aiello-pm/project-management-portfolio)

---

## 1. Fondamentali

| Comando | Effetto |
|---|---|
| `git commit` | Crea un commit nello storico |
| `git branch nome` | Crea un nuovo branch |
| `git checkout nome` | Spostati su un branch esistente |
| `git checkout -b nome` | Crea branch e spostati in un solo comando |
| `git merge nome` | Mergia il branch specificato nel branch corrente |
| `git rebase nome` | Riapplica i commit correnti su una nuova base |

---

## 2. Navigazione nello storico

| Comando | Effetto |
|---|---|
| `git checkout HEAD^` | Vai al commit parent (un livello su) |
| `git checkout HEAD^^` | Vai due livelli su |
| `git branch -f main HEAD^` | Sposta forzatamente un branch su un commit |
| `git reset HEAD^` | Annulla l'ultimo commit (solo locale) |
| `git revert HEAD` | Annulla l'ultimo commit in modo sicuro (anche su remote) |

> ⚠️ **Tastiera italiana:** usa sempre `^` al posto di `~` (tasto: Shift + ì)
> - `HEAD^` = parent diretto = equivalente di `HEAD~1`
> - `HEAD^^` = nonno = equivalente di `HEAD~2`

---

## 3. Cherry-pick e Rebase interattivo

| Comando | Effetto |
|---|---|
| `git cherry-pick C1 C2 C3` | Copia commit specifici sul branch corrente |
| `git rebase -i HEAD^^^` | Apre interfaccia interattiva per riordinare/eliminare/unire commit |

---

## 4. Tags e Describe

| Comando | Effetto |
|---|---|
| `git tag v1.0 C2` | Crea un tag permanente su un commit |
| `git describe main` | Mostra la distanza dal tag più vicino nel formato `tag_numCommit_gHash` |

---

## 5. Remote — Fondamentali

| Comando | Effetto |
|---|---|
| `git clone` | Clona un repository remoto in locale |
| `git fetch` | Scarica tutti i commit dal remote (non mergia) |
| `git pull` | Equivalente a `git fetch` + `git merge` |
| `git push` | Carica i commit locali sul remote |

> `git fetch` non tocca mai i branch locali — scarica solo i dati. Sei tu a decidere cosa farne.

---

## 6. Remote — Avanzato (refspec source:destination)

### La regola fondamentale

```
git push origin <source_locale>:<destination_remota>
git fetch origin <source_remota>:<destination_locale>
```

**Push e fetch sono speculari** — stessa sintassi, direzione opposta.

### Tabella comandi

| Comando | Effetto |
|---|---|
| `git push origin foo:main` | Pusha branch `foo` locale su `main` del remote |
| `git push origin main^:foo` | Pusha il parent di `main` su `foo` del remote |
| `git fetch origin main:foo` | Scarica `main` remoto e lo mette su `foo` locale |
| `git fetch origin C3:foo` | Scarica il commit C3 dal remote su `foo` locale |
| `git pull origin main:foo` | fetch di `main` su `foo` + merge nel branch corrente |
| `git pull origin C3:foo` | fetch di C3 su `foo` + merge nel branch corrente |

### Source vuota (fonte del nulla)

| Comando | Effetto |
|---|---|
| `git push origin :foo` | **Cancella** il branch `foo` dal remote |
| `git fetch origin :bar` | **Crea** il branch `bar` in locale (da nulla) |

---

## 7. Tracking remoto

| Comando | Effetto |
|---|---|
| `git checkout -b foo origin/main` | Crea `foo` locale che traccia `origin/main` |
| `git branch -u origin/main foo` | Imposta il tracking su un branch esistente |
| `git push origin foo` | Pusha su remote seguendo il tracking configurato |

---

## 8. Regole da ricordare

### Push vs Fetch — direzione opposta
```
push: locale ──────────────→ remote
fetch: locale ←────────────── remote
```

### Pull = fetch + merge
```bash
git pull origin foo
# equivalente a:
git fetch origin foo
git merge o/foo
```

```bash
git pull origin bar:bugFix
# equivalente a:
git fetch origin bar:bugFix
git merge bugFix
```

### Cancella / Crea da nulla
```bash
git push origin :foo     # cancella foo dal remote
git fetch origin :bar    # crea bar in locale
```

### Tastiera italiana — mai usare ~
```bash
# SBAGLIATO su tastiera IT (~ difficile da digitare)
git checkout HEAD~2

# CORRETTO
git checkout HEAD^^
git push origin main^:foo
```

---

## 9. Workflow tipico con remote

```bash
# 1. Scarica aggiornamenti dal remote
git fetch origin

# 2. Guarda cosa è cambiato
git log o/main

# 3. Mergia nel tuo branch locale
git merge o/main
# oppure in un solo comando:
git pull origin main

# 4. Fai le tue modifiche e committa
git commit

# 5. Pusha sul remote
git push origin main
```

---

## 10. Cheatsheet rapido

```bash
# Branch
git checkout -b feature    # crea e spostati
git branch -f main HEAD^   # sposta branch a forza
git merge feature          # mergia in current

# Storico
git reset HEAD^            # annulla commit locale
git revert HEAD            # annulla commit (safe per remote)
git cherry-pick C1 C2      # copia commit specifici

# Remote base
git fetch                  # scarica tutto
git pull                   # fetch + merge
git push                   # carica su remote

# Remote avanzato
git push origin src:dst    # push con refspec
git fetch origin src:dst   # fetch con refspec
git push origin :branch    # cancella branch remoto
git fetch origin :branch   # crea branch locale
```

---

*Generato come reference document — Phase 1 completata ✅*
*Prossimo step: Phase 2 — Python/pandas + SQL*
