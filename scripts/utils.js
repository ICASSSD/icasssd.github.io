/**
 * Common Utility Functions
 */

/**
 * Parses BibTeX string into an array of objects.
 * Simple parser, assumes standard BibTeX formatting.
 * @param {string} input - The raw BibTeX string.
 * @returns {Array<Object>} - Array of publication objects.
 */
function parseBibTeX(input) {
    const entries = [];
    // Split by @ to get raw entries
    const rawEntries = input.split('@').slice(1);

    rawEntries.forEach(raw => {
        const typeMatch = raw.match(/^(\w+)\s*{/);
        if (!typeMatch) return;

        const type = typeMatch[1];

        // Find body - simply between first { and last }
        const bodyStart = raw.indexOf('{');
        const bodyEnd = raw.lastIndexOf('}');
        if (bodyStart === -1) return;

        const body = raw.substring(bodyStart + 1, bodyEnd > bodyStart ? bodyEnd : raw.length);
        const entry = { type: type, raw: body };

        // Extract Citation Key
        const keyMatch = body.match(/^\s*([^,]+),/);
        if (keyMatch) {
            entry.key = keyMatch[1].trim();
        }

        // Basic line-by-line parsing for fields
        const lines = body.split('\n');
        lines.forEach(line => {
            const eqIndex = line.indexOf('=');
            if (eqIndex > -1) {
                const key = line.substring(0, eqIndex).trim().toLowerCase();
                let value = line.substring(eqIndex + 1).trim();

                // Cleanup trailing comma
                if (value.endsWith(',')) value = value.slice(0, -1);

                // Cleanup braces/quotes
                if ((value.startsWith('{') && value.endsWith('}')) || (value.startsWith('"') && value.endsWith('"'))) {
                    value = value.slice(1, -1);
                }

                entry[key] = value;
            }
        });

        if (entry.title) entries.push(entry);
    });

    // Sort by year descending by default
    return entries.sort((a, b) => (b.year || 0) - (a.year || 0));
}

// Export for module usage if needed (though we use script tags)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseBibTeX };
}
