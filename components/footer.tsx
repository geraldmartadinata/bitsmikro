import { Activity } from "lucide-react";

const footerColumns = [
  {
    heading: "Fitur",
    links: ["Analisis Gejala", "Plan 7 Hari", "Find Partner"],
  },
  {
    heading: "Perusahaan",
    links: ["Tentang", "Cara Kerja"],
  },
  {
    heading: "Legal",
    links: ["Kebijakan Privasi", "Syarat Layanan"],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-[#faf8f1]">
      <div className="mx-auto max-w-6xl px-5 pb-6 pt-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-terracotta text-cream">
                <Activity className="h-4 w-4" />
              </span>
              <span className="font-display text-lg">Zense</span>
            </div>
            <p className="text-sm text-muted">
              Pendamping kesehatan pribadimu
            </p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <h4 className="text-xs font-medium uppercase tracking-widest text-muted">
                {col.heading}
              </h4>
              {col.links.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-ink/80 transition-colors hover:text-terracotta"
                >
                  {link}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-hairline pt-6">
          <p className="mx-auto max-w-3xl text-center text-xs leading-relaxed text-muted">
            Zense adalah alat edukasi pola hidup — bukan pengganti diagnosis
            atau saran medis profesional. Untuk kondisi serius atau
            berkelanjutan, konsultasikan dengan tenaga kesehatan.
          </p>
          <p className="mt-4 text-center text-xs text-muted">
            © 2026 Zense · Tim . untuk Bitsmikro Innovative Vibecode
            2026
          </p>
        </div>
      </div>
    </footer>
  );
}