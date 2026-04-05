import { Globe } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative border-t border-primary/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded border border-primary flex items-center justify-center">
                <Globe className="w-4 h-4 text-primary" />
              </div>
              <span className="font-display text-primary tracking-widest">MONUSGB 2026</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Modelo Distrital de Naciones Unidas. SABANA GRANDE DE BOYA.
            </p>
          </div>

          <div>
            <h4 className="font-display text-foreground tracking-widest text-sm mb-4">NAVEGACIÓN</h4>
            <ul className="space-y-2">
              {["Acerca de", "Comisiones", "Cronograma", "Inscripción"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase().replace("ó", "o").replace("á", "a")}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-foreground tracking-widest text-sm mb-4">CONTACTO</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <licelider1704@gmail.com</li>
              <li>SABANA GRANDE DE BOYA , MONTEPLATA</li>
              <li>15 — 28 de ABRIL, 2026</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © 2026 MONUSGB — ESTA PAGINA WEB ESTA ECHA POR ALBERT SILVESTRE REGIONAL 17.
          </p>
          <a href="/admin" className="text-xs text-primary hover:neon-text transition-colors">
            Panel de Administración →
          </a>
        </div>
      </div>
    </footer>
  )
}
