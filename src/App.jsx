import { useEffect } from "react";
import gsap from "gsap";

const formatNumber = (value) => value.toLocaleString("pt-BR");

export default function App() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const pointerFine = window.matchMedia("(pointer: fine)").matches;
    const cleanups = [];
    const addCleanup = (fn) => cleanups.push(fn);

    const glow = document.querySelector(".cursor-glow");
    if (glow && pointerFine && !prefersReducedMotion) {
      let glowVisible = false;
      const handleMove = (event) => {
        glow.style.left = `${event.clientX}px`;
        glow.style.top = `${event.clientY}px`;
        if (!glowVisible) {
          glow.style.opacity = "1";
          glowVisible = true;
        }
      };
      const handleLeave = () => {
        glow.style.opacity = "0";
        glowVisible = false;
      };

      window.addEventListener("mousemove", handleMove);
      window.addEventListener("mouseleave", handleLeave);
      addCleanup(() => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseleave", handleLeave);
      });
    }

    const parallaxItems = Array.from(
      document.querySelectorAll("[data-parallax]")
    );
    const hero = document.querySelector(".hero");
    if (hero && parallaxItems.length && pointerFine && !prefersReducedMotion) {
      let rafId = null;
      let targetX = 0;
      let targetY = 0;

      const updateParallax = () => {
        parallaxItems.forEach((item) => {
          const depth = Number(item.dataset.parallax) || 8;
          item.style.setProperty("--parallax-x", `${targetX * depth}px`);
          item.style.setProperty("--parallax-y", `${targetY * depth}px`);
        });
        rafId = null;
      };

      const handleMove = (event) => {
        const rect = hero.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        targetX = x;
        targetY = y;
        if (!rafId) {
          rafId = requestAnimationFrame(updateParallax);
        }
      };

      const handleLeave = () => {
        targetX = 0;
        targetY = 0;
        if (!rafId) {
          rafId = requestAnimationFrame(updateParallax);
        }
      };

      hero.addEventListener("mousemove", handleMove);
      hero.addEventListener("mouseleave", handleLeave);
      addCleanup(() => {
        hero.removeEventListener("mousemove", handleMove);
        hero.removeEventListener("mouseleave", handleLeave);
        if (rafId) {
          cancelAnimationFrame(rafId);
        }
      });
    }

    const magneticTargets = Array.from(
      document.querySelectorAll("[data-magnetic]")
    );
    if (magneticTargets.length && pointerFine && !prefersReducedMotion) {
      magneticTargets.forEach((target) => {
        const handleMove = (event) => {
          const rect = target.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;
          target.style.setProperty("--magnet-x", `${x * 0.2}px`);
          target.style.setProperty("--magnet-y", `${y * 0.2}px`);
        };

        const handleLeave = () => {
          target.style.setProperty("--magnet-x", "0px");
          target.style.setProperty("--magnet-y", "0px");
        };

        target.addEventListener("mousemove", handleMove);
        target.addEventListener("mouseleave", handleLeave);
        addCleanup(() => {
          target.removeEventListener("mousemove", handleMove);
          target.removeEventListener("mouseleave", handleLeave);
        });
      });
    }

    const tiltCards = Array.from(document.querySelectorAll(".tilt"));
    if (tiltCards.length && pointerFine && !prefersReducedMotion) {
      tiltCards.forEach((card) => {
        const handleMove = (event) => {
          const rect = card.getBoundingClientRect();
          const x = (event.clientX - rect.left) / rect.width - 0.5;
          const y = (event.clientY - rect.top) / rect.height - 0.5;
          card.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
          card.style.setProperty("--tilt-y", `${(x * 8).toFixed(2)}deg`);
        };

        const handleLeave = () => {
          card.style.setProperty("--tilt-x", "0deg");
          card.style.setProperty("--tilt-y", "0deg");
        };

        card.addEventListener("mousemove", handleMove);
        card.addEventListener("mouseleave", handleLeave);
        addCleanup(() => {
          card.removeEventListener("mousemove", handleMove);
          card.removeEventListener("mouseleave", handleLeave);
        });
      });
    }

    const revealItems = Array.from(document.querySelectorAll(".reveal"));
    if (revealItems.length) {
      if (prefersReducedMotion) {
        revealItems.forEach((item) => item.classList.add("is-visible"));
      } else {
        const revealObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.2 }
        );

        revealItems.forEach((item) => revealObserver.observe(item));
        addCleanup(() => revealObserver.disconnect());
      }
    }

    const countTargets = Array.from(document.querySelectorAll("[data-count]"));
    const animateCount = (el) => {
      const target = Number(el.dataset.count) || 0;
      const suffix = el.dataset.suffix || "";
      const duration = 1200;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        el.textContent = `${formatNumber(value)}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    };

    if (countTargets.length) {
      if (prefersReducedMotion) {
        countTargets.forEach((el) => {
          const suffix = el.dataset.suffix || "";
          const target = Number(el.dataset.count) || 0;
          el.textContent = `${formatNumber(target)}${suffix}`;
        });
      } else {
        const countObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                animateCount(entry.target);
                countObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.6 }
        );

        countTargets.forEach((el) => countObserver.observe(el));
        addCleanup(() => countObserver.disconnect());
      }
    }

    if (!prefersReducedMotion) {
      const heroTween = gsap.from("[data-animate]", {
        opacity: 0,
        y: 24,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        delay: 0.1,
      });

      const visualTween = gsap.from(".hero-visual", {
        opacity: 0,
        scale: 0.96,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.25,
      });

      addCleanup(() => {
        heroTween.kill();
        visualTween.kill();
      });
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div>
      <div className="cursor-glow" aria-hidden="true"></div>

      <header className="hero" id="topo">
        <nav className="nav">
          <a className="logo" href="#topo">
            Dieta da Selva
          </a>
          <div className="nav-links">
            <a href="#manifesto">Manifesto</a>
            <a href="#rituais">Rituais</a>
            <a href="#planos">Planos</a>
            <a href="#cta" className="btn btn-ghost" data-magnetic="true">
              Entrar na trilha
            </a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow" data-animate="true">
              Forca limpa. Sabor real.
            </p>
            <h1 data-animate="true">
              A dieta que <span className="highlight">acorda</span>
              <br />
              sua selva interna.
            </h1>
            <p className="lead" data-animate="true">
              Um plano alimentar com fases claras, combinacoes vivas e uma rotina
              simples para quem quer energia constante sem perder prazer.
            </p>
            <div className="hero-actions" data-animate="true">
              <a href="#planos" className="btn btn-primary" data-magnetic="true">
                Quero o guia
              </a>
              <a
                href="#manifesto"
                className="btn btn-secondary"
                data-magnetic="true"
              >
                Ver ritual
              </a>
            </div>
            <div className="stats" data-animate="true">
              <div className="stat-card">
                <span className="stat-value" data-count="14" data-suffix=" dias">
                  0
                </span>
                <span className="stat-label">ciclo selvagem</span>
              </div>
              <div className="stat-card">
                <span className="stat-value" data-count="120" data-suffix="k">
                  0
                </span>
                <span className="stat-label">porcoes ajustadas</span>
              </div>
              <div className="stat-card">
                <span className="stat-value" data-count="3" data-suffix=" fases">
                  0
                </span>
                <span className="stat-label">rituais diarios</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div
              className="orb orb-main parallax"
              data-parallax="18"
              style={{ "--parallax-rotate": "-12deg" }}
            ></div>
            <div
              className="orb orb-ring parallax"
              data-parallax="12"
              style={{ "--parallax-rotate": "6deg" }}
            ></div>
            <div
              className="orb orb-leaf parallax"
              data-parallax="20"
              style={{ "--parallax-rotate": "18deg" }}
            ></div>
            <div className="orb orb-seed parallax" data-parallax="8"></div>

            <div
              className="floating-tag parallax"
              data-parallax="14"
              style={{
                "--parallax-rotate": "-6deg",
                top: "20px",
                left: "20px",
              }}
            >
              <span>+ energia real</span>
            </div>
            <div
              className="floating-tag parallax"
              data-parallax="10"
              style={{
                "--parallax-rotate": "8deg",
                bottom: "60px",
                right: "140px",
              }}
            >
              <span>zero fome vazia</span>
            </div>
            <div className="hero-card parallax" data-parallax="16">
              <p className="card-title">Mapa da Selva</p>
              <p className="card-text">
                Combine folhas vivas, frutos densos e proteinas limpas.
              </p>
              <div className="card-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="marquee">
        <div className="marquee-track">
          <span>cacau cru</span>
          <span>castanha do para</span>
          <span>manga rosa</span>
          <span>hortela selvagem</span>
          <span>cafe verde</span>
          <span>legumes vivos</span>
          <span>sementes tostadas</span>
          <span>proteina limpa</span>
          <span>cacau cru</span>
          <span>castanha do para</span>
          <span>manga rosa</span>
          <span>hortela selvagem</span>
          <span>cafe verde</span>
          <span>legumes vivos</span>
          <span>sementes tostadas</span>
          <span>proteina limpa</span>
        </div>
      </section>

      <main>
        <section className="section manifesto reveal" id="manifesto">
          <div className="section-header">
            <p className="eyebrow">Manifesto</p>
            <h2>Um ritual alimentar feito para dias intensos.</h2>
            <p>
              Nada de dietas secas. A Dieta da Selva usa contrastes de textura,
              cores e fases para manter foco e saciedade, sem perder liberdade.
            </p>
          </div>
          <div className="manifesto-grid">
            <article className="manifesto-card">
              <h3>Raiz</h3>
              <p>
                Comece com bases densas e minerais para sustentar o ritmo da
                manha.
              </p>
            </article>
            <article className="manifesto-card">
              <h3>Ritmo</h3>
              <p>Intercale picos leves e reforcos inteligentes sem fome rebote.</p>
            </article>
            <article className="manifesto-card">
              <h3>Fluxo</h3>
              <p>Finalize com combinacoes suaves que preparam o sono profundo.</p>
            </article>
          </div>
        </section>

        <section className="section rituals reveal" id="rituais">
          <div className="section-header">
            <p className="eyebrow">Rituais diarios</p>
            <h2>Tres fases para cada dia render mais.</h2>
          </div>
          <div className="rituals-grid">
            <article className="ritual-card tilt">
              <div className="ritual-badge">Fase 01</div>
              <h3>Alvorada</h3>
              <p>Hidratacao intensa, frutas vivas e um toque de proteina leve.</p>
              <ul>
                <li>agua mineral + limao</li>
                <li>shake verde com gengibre</li>
                <li>sementes crocantes</li>
              </ul>
            </article>
            <article className="ritual-card tilt">
              <div className="ritual-badge">Fase 02</div>
              <h3>Cacada</h3>
              <p>Refeicoes densas para manter foco e resistencia o dia todo.</p>
              <ul>
                <li>proteina limpa grelhada</li>
                <li>folhas vivas e legumes</li>
                <li>carbo inteligente</li>
              </ul>
            </article>
            <article className="ritual-card tilt">
              <div className="ritual-badge">Fase 03</div>
              <h3>Acampamento</h3>
              <p>Combinacoes suaves para recuperar o corpo e desligar a mente.</p>
              <ul>
                <li>sopa cremosa de legumes</li>
                <li>infusao calmante</li>
                <li>gorduras boas</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="section track reveal" id="trilha">
          <div className="section-header">
            <p className="eyebrow">Trilha de 14 dias</p>
            <h2>Planejamento simples, resultado consistente.</h2>
          </div>
          <div className="track-grid">
            <div className="track-card">
              <h3>Semana 1</h3>
              <p>Desinflamar, ganhar energia limpa e acordar o apetite certo.</p>
              <div className="track-bar">
                <span style={{ width: "45%" }}></span>
              </div>
            </div>
            <div className="track-card">
              <h3>Semana 2</h3>
              <p>Equilibrar rotina, consolidar o ritmo e acelerar resultados.</p>
              <div className="track-bar">
                <span style={{ width: "85%" }}></span>
              </div>
            </div>
            <div className="track-card track-card-highlight">
              <h3>Mapa completo</h3>
              <p>Lista de compras, substituicoes e combinacoes prontas.</p>
              <a href="#planos" className="btn btn-secondary" data-magnetic="true">
                Ver planos
              </a>
            </div>
          </div>
        </section>

        <section className="section planos reveal" id="planos">
          <div className="section-header">
            <p className="eyebrow">Planos</p>
            <h2>Escolha o ritmo ideal para sua selva.</h2>
          </div>
          <div className="plan-grid">
            <article className="plan-card">
              <h3>Trilha Base</h3>
              <p className="plan-price">R$ 59</p>
              <ul>
                <li>Guia de 14 dias</li>
                <li>Cardapios diarios</li>
                <li>Lista de compras</li>
              </ul>
              <button className="btn btn-secondary" data-magnetic="true">
                Comecar
              </button>
            </article>
            <article className="plan-card plan-card-featured">
              <div className="plan-tag">Mais forte</div>
              <h3>Trilha Alpha</h3>
              <p className="plan-price">R$ 119</p>
              <ul>
                <li>Guia completo + extras</li>
                <li>Rotina personalizada</li>
                <li>Suporte semanal</li>
              </ul>
              <button className="btn btn-primary" data-magnetic="true">
                Quero esse
              </button>
            </article>
            <article className="plan-card">
              <h3>Trilha Pro</h3>
              <p className="plan-price">R$ 199</p>
              <ul>
                <li>Mapa avancado</li>
                <li>Consultoria 1:1</li>
                <li>Receitas exclusivas</li>
              </ul>
              <button className="btn btn-secondary" data-magnetic="true">
                Falar comigo
              </button>
            </article>
          </div>
        </section>

        <section className="section depoimentos reveal" id="depoimentos">
          <div className="section-header">
            <p className="eyebrow">Quem viveu</p>
            <h2>Resultados reais, rotina sustentavel.</h2>
          </div>
          <div className="testimonials-grid">
            <article className="testimonial">
              <p>
                "O ritual da manha mudou meu foco. Finalmente parei de ter fome
                o tempo todo."
              </p>
              <span>Camila, 28</span>
            </article>
            <article className="testimonial">
              <p>
                "As fases sao simples e claras. Em duas semanas ja senti mais
                leveza e energia."
              </p>
              <span>Rodrigo, 35</span>
            </article>
            <article className="testimonial">
              <p>
                "Gosto do sabor, da lista de compras e do ritmo. E facil de
                manter no dia a dia."
              </p>
              <span>Pri, 41</span>
            </article>
          </div>
        </section>

        <section className="section cta reveal" id="cta">
          <div className="cta-card">
            <div>
              <p className="eyebrow">Pronto para comecar?</p>
              <h2>Entre na trilha agora e receba o mapa completo.</h2>
            </div>
            <div className="cta-actions">
              <button className="btn btn-primary" data-magnetic="true">
                Quero entrar
              </button>
              <button className="btn btn-ghost" data-magnetic="true">
                Falar com time
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <span className="logo">Dieta da Selva</span>
          <p>Energia limpa, sabor real, rotina simples.</p>
        </div>
        <div className="footer-links">
          <a href="#manifesto">Manifesto</a>
          <a href="#planos">Planos</a>
          <a href="#cta">Contato</a>
        </div>
      </footer>
    </div>
  );
}