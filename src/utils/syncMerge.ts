/**
 * Smart-Merge Utility für VacaTrack Geräte-Sync
 *
 * Statt Daten beim Import zu überschreiben, werden sie intelligent zusammengeführt:
 * - Neue Einträge (unbekannte ID) → hinzufügen
 * - Bestehende Einträge (gleiche ID) → aktualisieren
 * - Lokale Einträge, die im Import nicht vorkommen → beibehalten
 */

export interface MergeResult {
    added: number;
    updated: number;
    unchanged: number;
}

/**
 * Mergt zwei Arrays von Objekten mit `id`-Feld.
 * Gibt das zusammengeführte Array + Statistiken zurück.
 */
export function mergeById<T extends { id: string }>(
    local: T[],
    incoming: T[],
): { merged: T[]; stats: MergeResult } {
    const localMap = new Map(local.map(item => [item.id, item]));
    let added = 0;
    let updated = 0;

    for (const item of incoming) {
        const existing = localMap.get(item.id);
        if (!existing) {
            // Neuer Eintrag
            localMap.set(item.id, item);
            added++;
        } else if (JSON.stringify(existing) !== JSON.stringify(item)) {
            // Bestehender Eintrag, aber Inhalt hat sich geändert → aktualisieren
            localMap.set(item.id, item);
            updated++;
        }
    }

    const unchanged = local.length - updated;

    return {
        merged: Array.from(localMap.values()),
        stats: { added, updated, unchanged },
    };
}

/** Gesamtstatistik über alle Module */
export interface SyncSummary {
    inventory: MergeResult;
    activities: MergeResult;
    expenses: MergeResult;
    logbook: MergeResult;
    trips: MergeResult;
    totalAdded: number;
    totalUpdated: number;
}

export function createEmptySummary(): SyncSummary {
    const empty: MergeResult = { added: 0, updated: 0, unchanged: 0 };
    return {
        inventory: { ...empty },
        activities: { ...empty },
        expenses: { ...empty },
        logbook: { ...empty },
        trips: { ...empty },
        totalAdded: 0,
        totalUpdated: 0,
    };
}
