import { useEffect } from "react";
import gsap from "gsap";

const WHATSAPP_LINK =
  "https://api.whatsapp.com/send/?phone=554499889644&text=Fala+Daniel%2C+vim+da+Bio+e+quero+conhecer+o+PDS+%EF%BF%BD&type=phone_number&app_absent=0";

const formatNumber = (value) => value.toLocaleString("pt-BR");

export default function App() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const pointerFine = window.matchMedia("(pointer: fine)").matches;
    const cleanups = [];
    const addCleanup = (fn) => cleanups.push(fn);

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
      <header className="hero" id="topo">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-alert" data-animate="true">
              <span>LEIA ANTES QUE SAIA DO AR</span>
            </div>
            <h1 data-animate="true">
              Transforme seu Corpo, Energia e Libido com uma dieta que a Indústria
              não quer que você saiba
            </h1>
            <p className="lead story-time" data-animate="true">
              É 03:17 da manhã.
            </p>
          </div>
        </div>
      </header>

      <main>
        <section className="section reveal story-start story-tight-end" id="historia">
          <div className="section-body story-stack">
            <p>
              Você está deitado na cama, rolando de um lado para o outro, olhando
              pro teto, enquanto pensa:
            </p>
            <blockquote>
              <p>
                "Por que todo mundo consegue resultados e eu não? Por que eu ainda
                me sinto inchado, cansado e sem energia, mesmo me matando na academia e
                contando cada caloria?"
              </p>
            </blockquote>
            <p>
              O celular vibra. É um amigo que você vê como “menos disciplinado que você”
              postando no Instagram: perdeu peso, ganhou músculo, tá com energia lá em cima.
            </p>
            <p>
              Você sente uma pontada de raiva e frustração. Tudo que você já ouviu:
            </p>
            <blockquote>
              <p>
                "Tem que passar fome pra emagrecer, comer de 3 em 3 horas, suar sangue na academia"
              </p>
            </blockquote>
            <p className="tight-next">
              ...não funcionou pra você. E olha, ninguém fala que isso pode estar te fazendo piorar ainda mais.
            </p>
          </div>
        </section>

        <div className="section-divider tight" aria-hidden="true"></div>

        <section className="section reveal section-tight section-tight-bottom" id="verdade">
          <div className="section-body story-stack">
            <p>
              O problema: você segue o que todos dizem que é certo, mas o corpo não responde. A cada refeição, sente inchaço, preguiça, irritação. E o pior: sente que o tempo tá contra você.
            </p>
            <p>
              Aqui está a verdade brutal: a mentalidade de vítima é uma armadilha.
            </p>
            <p>Você pensa:</p>
            <blockquote>
              <p>
                "Não é justo… eu merecia mais… por que funciona pros outros e não pra mim?"
              </p>
            </blockquote>
            <p>
              Quebre essa narrativa agora: funciona pros outros porque eles descobriram um princípio que você ainda não entendeu.
            </p>
            <p>
              O “incompetente” que parece ganhar resultados sem esforço não passa fome, não conta calorias, não vive na academia. Ele só descobriu como fazer o corpo queimar gordura de forma natural, enquanto aproveita a vida.
            </p>
            <p>
              É percepção sobre conhecimento. Saber comer certo, na hora certa, com os alimentos certos, pode ser mais poderoso que treinar 7x por semana e morrer de fome.
            </p>
            <p>Chega de seguir dietas que não respeitam seu corpo.</p>
            <p>A nova verdade é brutal:</p>
            <p>
              Seu corpo não precisa de restrição, calorias contadas ou academia. Ele precisa de alimentos que ativem seus hormônios, queimem gordura e aumentem testosterona naturalmente.
            </p>
            <p>
              Enquanto você sofre com shakes, saladas sem gosto e exercícios exaustivos, existe um caminho onde você come carne com gordura e seu corpo responde sozinho.
            </p>
            <p className="tight-next">
              Se você não está pronto para isso, feche esta página AGORA. Este método é para quem quer resultados reais, sem firulas.
            </p>
          </div>
        </section>

        <section className="section reveal section-tight-top section-tight-bottom">
          <div className="callout callout-pill">
            <p>Jogue para vencer. Pare de perder tempo com métodos que nunca funcionaram.</p>
          </div>
        </section>

        <section className="section reveal section-tight-top section-tight-bottom-md" id="daniel">
          <div className="bio-grid">
            <div className="bio-copy">
              <div className="section-body story-stack">
                <p className="name-highlight">Meu nome é Daniel Nou.</p>
                <p>
                  Eu estive no mesmo lugar que você: sobrepeso, sem testosterona, libido baixa, sem disposição.
                </p>
                <p>Hoje sou o que chamo de superhomem da vida real.</p>
              </div>
            </div>
            <div className="bio-photo">
              <picture>
                <img src="/images/danielnou.webp" alt="Daniel Nou" loading="lazy" />
              </picture>
            </div>
          </div>
          <div className="track-grid">
            <div className="track-card timeline-card">
              <span className="timeline-label">Primeiros 30 dias</span>
              <p>+10% de energia, primeira mudança visível no corpo</p>
            </div>
            <div className="track-card timeline-card">
              <span className="timeline-label">6 meses</span>
              <p>-12kg, disposição em níveis que eu nunca imaginei</p>
            </div>
            <div className="track-card timeline-card">
              <span className="timeline-label">1 ano</span>
              <p>corpo remodelado, testosterona normalizada, mental afiada</p>
            </div>
            <div className="track-card timeline-card">
              <span className="timeline-label">Hoje</span>
              <p>energia infinita, libido alta, corpo forte, me sinto um viking</p>
            </div>
          </div>
          <div className="callout callout-pill callout-split">
            <p>Eu não estou vendendo algo que eu não usei.</p>
            <p>
              Estou vendendo um método que funcionou na minha vida e na vida de
              pessoas comuns como você.
            </p>
          </div>
        </section>

        <div className="section-divider tight" aria-hidden="true"></div>

        <section className="section reveal section-tight section-tight-bottom-md" id="depoimentos">
          <div className="section-body story-stack">
            <h3 className="pillars-title">Meus clientes vivem mudanças semelhantes</h3>
          </div>
          <div className="testimonials-grid">
            <article className="testimonial">
              <h3>Aumauri, 50 anos</h3>
              <p className="testimonial-highlight">
                -16kg, disposição elevada, menos inchado, pré-diabetes eliminado,
                testosterona alta.
              </p>
              <p>Ele mesmo disse:</p>
              <p className="testimonial-quote">"Me sinto como um Viking!"</p>
            </article>
            <article className="testimonial testimonial-note">
              <p>Depoimentos Variados de mais 4 pessoas que tiveram resultados em poucos dias</p>
            </article>
            <article className="testimonial">
              <h3>Sérgio Nascimento</h3>
              <p className="testimonial-quote">
                Hoje quase 2 meses de protocolo selva saindo de 120 kg para 107 kg, 13 kg a menos, mais disposição, mais energia, sem sentir o corpo inchado, sem dores no corpo, hoje posso afirmar com toda a certeza que a dieta da selva mudou a minha vida.
              </p>
            </article>
          </div>
        </section>

        <div className="section-divider tight" aria-hidden="true"></div>

        <section className="section reveal section-tight-top section-tight-bottom" id="protocolo">
          <div className="section-body story-stack">
            <p className="protocol-highlight">
              Apresento a você o <span className="protocol-emphasis">PROTOCOLO SELVA</span> — o método{" "}
              <span className="protocol-emphasis">BRUTAL e EFICAZ</span> para emagrecer e ganhar massa,
              sem academia, sem passar fome, comendo carne com gordura.
            </p>
            <h3 className="pillars-title">Três pilares</h3>
          </div>
          <div className="rituals-grid">
            <article className="ritual-card tilt">
              <h3>FOME ZERO</h3>
              <p>O que é: Comer alimentos ricos em gordura e proteína, satisfazendo o corpo</p>
              <p>Resultado: Sem fome, energia constante</p>
              <p>Como vai se sentir: Livre da ansiedade por comida</p>
            </article>
            <article className="ritual-card tilt">
              <h3>QUEIMA MÁXIMA</h3>
              <p>O que é: Estratégia de alimentação que ativa a queima de gordura naturalmente</p>
              <p>Resultado: Redução de gordura mesmo em repouso</p>
              <p>Como vai se sentir: Corpo mais leve, menos inchado, inflamado</p>
            </article>
            <article className="ritual-card tilt">
              <h3>DISPOSIÇÃO SELVAGEM</h3>
              <p>O que é: Reeducação hormonal com alimentos certos</p>
              <p>Resultado: Testosterona elevada, libido em alta, músculos mais definidos</p>
              <p>Como vai se sentir: Confiança, vigor e masculinidade aflorada</p>
            </article>
          </div>
        </section>

        <section className="section reveal section-tight-top section-tight-bottom" id="comparacao">
          <div className="section-body story-stack">
            <h3 className="pillars-title center-title">
              Método tradicional <span className="vs-sep">vs</span>{" "}
              <span className="protocol-emphasis">Protocolo Selva</span>
            </h3>
          </div>
          <div className="compare-grid">
            <article className="compare-card">
              <p className="compare-title">Dieta comum: 3% de sucesso.</p>
              <p>Contagem de calorias, fome, academia exaustiva.</p>
              <p>Por que tão pouco?</p>
              <p>
                Porque o corpo humano não foi feito pra restrição — foi feito pra sobrevivência.
              </p>
              <p>
                Quando você corta calorias e vive com fome, o corpo entra em modo defesa, desacelera o metabolismo, retém gordura e rouba sua energia.
              </p>
              <p>
                É como tentar domar um leão prendendo ele numa jaula — ele não obedece, ele se apaga.
              </p>
            </article>
            <article className="compare-card compare-card-featured">
              <p className="compare-title">Protocolo Selva: até 87% de sucesso real.</p>
              <p>Carne com gordura, energia máxima, corpo respondendo naturalmente.</p>
              <p>Aqui é o oposto:</p>
              <p>Você dá ao corpo o combustível certo e ele entende o sinal —</p>
              <blockquote>
                <p>“estou seguro, posso queimar, posso crescer.”</p>
              </blockquote>
              <p>
                O corpo para de se defender e começa a funcionar como foi programado pela natureza.
              </p>
              <p>
                O corpo não precisa de contagem de calorias, ele precisa de sinais certos.
              </p>
              <p>
                Cada refeição no Protocolo Selva envia o comando de queimar gordura e gerar energia —
              </p>
              <p>é biologia, não sacrifício.</p>
            </article>
          </div>
        </section>

        <div className="section-divider tight" aria-hidden="true"></div>

        <section className="section reveal section-tight-top section-tight-bottom" id="exemplos">
          <div className="section-body story-stack">
            <h3 className="pillars-title">Você terá exemplos práticos, como:</h3>
            <div className="examples-grid">
              <article className="example-card">
                <p>
                  <span className="example-label">Café da manhã:</span> carne com gordura,
                  energia alta
                </p>
              </article>
              <article className="example-card">
                <p>
                  <span className="example-label">Almoço:</span> proteína animal, gordura
                  boa, queima ativa
                </p>
              </article>
              <article className="example-card">
                <p>
                  <span className="example-label">Jantar:</span> refeição estratégica,
                  hormônios equilibrados
                </p>
              </article>
            </div>
            <p className="examples-highlight">
              Imagine se seu corpo virasse um ímã de força, energia e resultado.
            </p>
            <p>
              O Protocolo Selva faz isso acontecer — mas as vagas são poucas, e o momento é agora.
            </p>
            <p>
              Este curso é extensão de você, é o que seu corpo já quer fazer, mas nunca soube como.
            </p>
            <div className="pill-list carousel">
              <div className="carousel-track">
                <span>Sem frescura</span>
                <span>Sem sofrimento</span>
                <span>Só resultados</span>
                <span>Sem frescura</span>
                <span>Sem sofrimento</span>
                <span>Só resultados</span>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider tight" aria-hidden="true"></div>

        <section className="section reveal section-tight-top section-tight-bottom" id="recebe">
          <div className="section-body story-stack">
            <h3 className="pillars-title">O que você recebe ao entrar no PROTOCOLO SELVA:</h3>
            <p className="section-lead">
              Tudo organizado para você aplicar no dia a dia e acelerar seus resultados.
            </p>
          </div>
          <div className="manifesto-grid">
            <article className="manifesto-card">
              <h3 className="manifesto-title">TREINAMENTO SELVA</h3>
              <p>
                Mais de 20 aulas! Aprenda tudo sobre a Dieta da Selva, jejum estratégico e exposição ao sol diário para maximizar queima de gordura, energia e testosterona.
              </p>
            </article>
            <article className="manifesto-card">
              <h3 className="manifesto-title">REFEIÇÕES E LISTA DE COMPRAS</h3>
              <p>
                Saiba exatamente como montar suas refeições, o que comprar e como comer sem passar fome, seguindo a dieta animal based.
              </p>
            </article>
            <article className="manifesto-card">
              <h3 className="manifesto-title">COMUNIDADE SELVA</h3>
              <p>
                Grupo exclusivo para compartilhar resultados, tirar dúvidas, trocar experiências e manter a motivação sempre lá em cima.
              </p>
            </article>
            <article className="manifesto-card">
              <h3 className="manifesto-title">SUPORTE DIRETO COMIGO</h3>
              <p>
                Tire suas dúvidas e receba orientação direta comigo para garantir que você siga o método sem erros.
              </p>
            </article>
            <article className="manifesto-card">
              <h3 className="manifesto-title">ATUALIZAÇÕES FUTURAS</h3>
              <p>
                Conteúdos novos, técnicas e ajustes liberados constantemente para manter seus resultados sempre crescendo.
              </p>
            </article>
          </div>
        </section>

        <div className="section-divider tight" aria-hidden="true"></div>

        <section className="section cta reveal section-tight-top" id="cta">
          <div className="cta-card">
            <div className="section-body story-stack">
              <p className="cta-kicker">As vagas são LIMITADAS.</p>
              <p>Não entre se você não estiver pronto para resultados reais.</p>
              <p>
                Se você não agir agora, vai ter que esperar meses para próxima abertura.
              </p>
              <p className="cta-decision">Decida agora:</p>
              <p>
                Clique abaixo e me chame no WhatsApp para entender como funciona e comece a transformar seu corpo, energia e vida com o{" "}
                <span className="protocol-emphasis">PROTOCOLO SELVA</span>.
              </p>
            </div>
            <div className="cta-actions">
              <a href={WHATSAPP_LINK} className="btn btn-primary btn-whatsapp" data-magnetic="true">
                <span className="btn-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                    <path
                      d="M12 2C6.49 2 2 6.49 2 12c0 1.98.58 3.91 1.68 5.58L2 22l4.54-1.64A9.9 9.9 0 0 0 12 22c5.51 0 10-4.49 10-10S17.51 2 12 2zm0 18.2c-1.63 0-3.2-.43-4.58-1.25l-.33-.2-2.7.98.98-2.62-.22-.34A8.2 8.2 0 0 1 3.8 12c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.68 8.2-8.2 8.2zm4.62-5.65c-.25-.12-1.5-.74-1.73-.82-.23-.09-.4-.12-.56.12-.16.25-.65.82-.8.99-.15.17-.3.19-.55.07-.25-.12-1.06-.39-2.02-1.24-.75-.67-1.25-1.5-1.4-1.75-.15-.25-.02-.39.1-.51.11-.11.25-.3.37-.45.12-.15.16-.25.25-.42.08-.17.04-.32-.02-.45-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.48c-.17 0-.45.07-.68.32-.23.25-.9.88-.9 2.13 0 1.25.92 2.46 1.05 2.63.12.17 1.82 2.78 4.4 3.9.62.27 1.1.43 1.48.55.62.2 1.18.17 1.62.1.5-.08 1.5-.61 1.71-1.2.21-.6.21-1.11.15-1.22-.06-.1-.23-.17-.48-.29z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                CHAMAR NO WHATSAPP!
              </a>
            </div>
            <p className="attention">
              ATENÇÃO: Se você ainda quer contar calorias, passar fome e treinar sem parar, este metódo não é pra você.
            </p>
          </div>
        </section>
      </main>

      <footer className="footer minimal-footer">
        <p>© 2026 Daniel Nou. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
