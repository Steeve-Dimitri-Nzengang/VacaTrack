import { useSelector } from 'react-redux';
import { selectLogEntries } from '../../store/slices/logbookSlice';
import { jsPDF } from 'jspdf';
import { useToast } from '../common/Toast';

const LOCATION_ICONS: Record<string, string> = {
    hotel: 'Hotel',
    restaurant: 'Restaurant',
    museum: 'Museum',
    'sehenswürdigkeit': 'Sehenswürdigkeit',
    strand: 'Strand',
    transport: 'Transport',
    sonstiges: 'Sonstiges',
};

/** Datum schön formatieren */
const formatDate = (dateStr: string): string => {
    try {
        return new Date(dateStr + 'T00:00:00').toLocaleDateString('de-DE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    } catch {
        return dateStr;
    }
};

const LogbookExport: React.FC = () => {
    const logEntries = useSelector(selectLogEntries);
    const { showToast } = useToast();

    const handleExportPDF = () => {
        if (logEntries.length === 0) return;

        const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const contentWidth = pageWidth - 2 * margin;
        let y = margin;

        // Sortiere chronologisch (älteste zuerst)
        const sorted = [...logEntries].sort((a, b) => {
            const dateA = `${a.date}T${a.time || '00:00'}`;
            const dateB = `${b.date}T${b.time || '00:00'}`;
            return dateA.localeCompare(dateB);
        });

        // ─── Titelseite ───
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('Reise-Logbuch', pageWidth / 2, 80, { align: 'center' });

        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(120, 120, 120);
        doc.text('VacaTrack', pageWidth / 2, 92, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`${sorted.length} Einträge`, pageWidth / 2, 102, { align: 'center' });

        // Datumsspanne
        if (sorted.length > 0) {
            const first = formatDate(sorted[0].date);
            const last = formatDate(sorted[sorted.length - 1].date);
            doc.setFontSize(11);
            doc.text(`${first} – ${last}`, pageWidth / 2, 114, { align: 'center' });
        }

        doc.setFontSize(9);
        doc.setTextColor(160, 160, 160);
        doc.text(`Exportiert am ${new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}`, pageWidth / 2, 130, { align: 'center' });

        // ─── Einträge ───
        doc.addPage();
        y = margin;

        let currentDate = '';

        sorted.forEach((entry) => {
            // Prüfe ob Seitenumbruch nötig (min 60mm für einen Eintrag)
            if (y > 250) {
                doc.addPage();
                y = margin;
            }

            // Tagesüberschrift wenn neues Datum
            if (entry.date !== currentDate) {
                currentDate = entry.date;

                if (y > margin) y += 6; // Abstand vor Datum

                // Datums-Linie
                doc.setDrawColor(46, 125, 50);
                doc.setLineWidth(0.5);
                doc.line(margin, y, margin + contentWidth, y);
                y += 6;

                doc.setFontSize(13);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(46, 125, 50);
                doc.text(formatDate(entry.date), margin, y);
                y += 8;
            }

            // ─── Einzelner Eintrag ───

            // Titel
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(33, 33, 33);
            doc.text(entry.title, margin + 4, y);
            y += 5;

            // Meta-Zeile: Uhrzeit + Ort + Typ
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(100, 100, 100);
            const meta: string[] = [];
            if (entry.time) meta.push(entry.time + ' Uhr');
            meta.push(entry.location);
            meta.push(LOCATION_ICONS[entry.locationType] || entry.locationType);
            doc.text(meta.join('  |  '), margin + 4, y);
            y += 5;

            // Beschreibung
            if (entry.description) {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(60, 60, 60);

                const lines = doc.splitTextToSize(entry.description, contentWidth - 8);
                lines.forEach((line: string) => {
                    if (y > 275) {
                        doc.addPage();
                        y = margin;
                    }
                    doc.text(line, margin + 4, y);
                    y += 4.5;
                });
            }

            y += 6; // Abstand zwischen Einträgen
        });

        // ─── Fußzeile auf jeder Seite ───
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(180, 180, 180);
            doc.text(
                `VacaTrack – Seite ${i} von ${totalPages}`,
                pageWidth / 2,
                doc.internal.pageSize.getHeight() - 10,
                { align: 'center' }
            );
        }

        // Download
        doc.save('vacatrack-logbuch.pdf');
        showToast('📄 Logbuch als PDF exportiert!');
    };

    return (
        <div className="card">
            <h3>� Logbuch exportieren</h3>
            <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--text-secondary)', margin: '0 0 var(--space-md)' }}>
                Exportiere dein Reise-Logbuch als druckfertige PDF-Datei.
            </p>
            <button onClick={handleExportPDF} className="button" disabled={logEntries.length === 0}>
                📄 Als PDF herunterladen
            </button>
        </div>
    );
};

export default LogbookExport;