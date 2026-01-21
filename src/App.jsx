import { useEffect } from "react";
import gsap from "gsap";

const formatNumber = (value) => value.toLocaleString("pt-BR");
const WHATSAPP_LINK =
  "https://api.whatsapp.com/send/?phone=554499889644&text=Fala+Daniel%2C+vim+da+Bio+e+quero+conhecer+o+PDS+%EF%BF%BD&type=phone_number&app_absent=0";

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
            Protocolo Selva
          </a>
          <div className="nav-links">
            <a href="#historia">Historia</a>
            <a href="#protocolo">Protocolo</a>
            <a href="#depoimentos">Resultados</a>
            <a
              href={WHATSAPP_LINK}
              className="btn btn-ghost"
              data-magnetic="true"
            >
              Chamar no WhatsApp
            </a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow" data-animate="true">
              LEIA ANTES QUE SAIA DO AR
            </p>
            <h1 data-animate="true">
              Transforme seu Corpo, Energia e Libido com uma dieta que a{" "}
              <span className="highlight">Industria</span> nao quer que voce saiba
            </h1>
            <p className="lead" data-animate="true">
              Jogue para vencer. Pare de perder tempo com metodos que nunca
              funcionaram.
            </p>
            <div className="hero-actions" data-animate="true">
              <a
                href={WHATSAPP_LINK}
                className="btn btn-primary"
                data-magnetic="true"
              >
                CHAMAR NO WHATSAPP!
              </a>
              <a
                href="#historia"
                className="btn btn-secondary"
                data-magnetic="true"
              >
                Ler a historia
              </a>
            </div>
            <div className="stats" data-animate="true">
              <div className="stat-card">
                <span className="stat-value" data-count="10" data-suffix="% energia">
                  0
                </span>
                <span className="stat-label">Primeiros 30 dias</span>
              </div>
              <div className="stat-card">
                <span className="stat-value" data-count="12" data-suffix="kg">
                  0
                </span>
                <span className="stat-label">6 meses</span>
              </div>
              <div className="stat-card">
                <span className="stat-value" data-count="1" data-suffix=" ano">
                  0
                </span>
                <span className="stat-label">Corpo remodelado</span>
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
              <span>sem fome</span>
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
              <span>energia alta</span>
            </div>
            <div className="hero-card parallax" data-parallax="16">
              <p className="card-title">Protocolo Selva</p>
              <p className="card-text">
                Metodo brutal para queima natural e hormonios ativados.
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
          <span>fome zero</span>
          <span>queima maxima</span>
          <span>disposicao selvagem</span>
          <span>protocolo selva</span>
          <span>carne com gordura</span>
          <span>energia maxima</span>
          <span>testosterona alta</span>
          <span>resultados reais</span>
          <span>fome zero</span>
          <span>queima maxima</span>
          <span>disposicao selvagem</span>
          <span>protocolo selva</span>
          <span>carne com gordura</span>
          <span>energia maxima</span>
          <span>testosterona alta</span>
          <span>resultados reais</span>
        </div>
      </section>

      <main>
        <section className="section reveal" id="historia">
          <div className="section-header">
            <p className="eyebrow">E 03:17 da manha.</p>
            <h2>Voce esta deitado na cama, rolando de um lado para o outro.</h2>
          </div>
          <div className="section-body">
            <p>
              Voce esta deitado na cama, rolando de um lado para o outro, olhando
              pro teto, enquanto pensa:
            </p>
            <blockquote>
              <p>
                "Por que todo mundo consegue resultados e eu nao? Por que eu
                ainda me sinto inchado, cansado e sem energia, mesmo me matando
                na academia e contando cada caloria?"
              </p>
            </blockquote>
            <p>
              O celular vibra. E um amigo que voce ve como "menos disciplinado
              que voce" postando no Instagram: perdeu peso, ganhou musculo, ta
              com energia la em cima.
            </p>
            <p>
              Voce sente uma pontada de raiva e frustracao. Tudo que voce ja
              ouviu:
            </p>
            <blockquote>
              <p>
                "Tem que passar fome pra emagrecer, comer de 3 em 3 horas, suar
                sangue na academia"
              </p>
            </blockquote>
            <p>
              ... nao funcionou pra voce. E olha, ninguem fala que isso pode
              estar te fazendo piorar ainda mais.
            </p>
            <p>
              O problema: voce segue o que todos dizem que e certo, mas o corpo
              nao responde. A cada refeicao, sente inchaco, preguica, irritacao.
              E o pior: sente que o tempo ta contra voce.
            </p>
          </div>
        </section>

        <section className="section reveal" id="verdade">
          <div className="section-header">
            <p className="eyebrow">A verdade brutal</p>
            <h2>A mentalidade de vitima e uma armadilha.</h2>
          </div>
          <div className="section-body">
            <p>
              Aqui esta a verdade brutal: a mentalidade de vitima e uma
              armadilha.
            </p>
            <p>Voce pensa:</p>
            <blockquote>
              <p>
                "Nao e justo... eu merecia mais... por que funciona pros outros
                e nao pra mim?"
              </p>
            </blockquote>
            <p>
              Quebre essa narrativa agora: funciona pros outros porque eles
              descobriram um principio que voce ainda nao entendeu.
            </p>
            <p>
              O "incompetente" que parece ganhar resultados sem esforco nao
              passa fome, nao conta calorias, nao vive na academia. Ele so
              descobriu como fazer o corpo queimar gordura de forma natural,
              enquanto aproveita a vida.
            </p>
            <p>
              E percepcao sobre conhecimento. Saber comer certo, na hora certa,
              com os alimentos certos, pode ser mais poderoso que treinar 7x por
              semana e morrer de fome.
            </p>
            <p>Chega de seguir dietas que nao respeitam seu corpo.</p>
            <p>A nova verdade e brutal:</p>
            <p>
              Seu corpo nao precisa de restricao, calorias contadas ou academia.
              Ele precisa de alimentos que ativem seus hormonios, queimem
              gordura e aumentem testosterona naturalmente.
            </p>
            <p>
              Enquanto voce sofre com shakes, saladas sem gosto e exercicios
              exaustivos, existe um caminho onde voce come carne com gordura e
              seu corpo responde sozinho.
            </p>
            <p>
              Se voce nao esta pronto para isso, feche esta pagina AGORA. Este
              metodo e para quem quer resultados reais, sem firulas.
            </p>
          </div>
        </section>

        <section className="section reveal" id="daniel">
          <div className="section-header">
            <p className="eyebrow">Quem sou eu</p>
            <h2>Meu nome e Daniel Nou.</h2>
          </div>
          <div className="section-body">
            <p>
              Eu estive no mesmo lugar que voce: sobrepeso, sem testosterona,
              libido baixa, sem disposicao.
            </p>
            <p>Hoje sou o que chamo de superhomem da vida real.</p>
          </div>
          <div className="track-grid">
            <div className="track-card">
              <h3>Primeiros 30 dias</h3>
              <p>+10% de energia, primeira mudanca visivel no corpo.</p>
            </div>
            <div className="track-card">
              <h3>6 meses</h3>
              <p>-12kg, disposicao em niveis que eu nunca imaginei.</p>
            </div>
            <div className="track-card">
              <h3>1 ano</h3>
              <p>Corpo remodelado, testosterona normalizada, mental afiada.</p>
            </div>
            <div className="track-card track-card-highlight">
              <h3>Hoje</h3>
              <p>Energia infinita, libido alta, corpo forte, me sinto um viking.</p>
            </div>
          </div>
          <div className="section-body">
            <p>
              Eu nao estou vendendo algo que eu nao usei. Estou vendendo um
              metodo que funcionou na minha vida e na vida de pessoas comuns
              como voce.
            </p>
          </div>
        </section>

        <section className="section depoimentos reveal" id="depoimentos">
          <div className="section-header">
            <p className="eyebrow">Resultados reais</p>
            <h2>Meus clientes vivem mudancas semelhantes.</h2>
          </div>
          <div className="testimonials-grid">
            <article className="testimonial">
              <h3>Aumauri, 50 anos</h3>
              <p>
                -16kg, disposicao elevada, menos inchado, pre-diabetes
                eliminado, testosterona alta. Ele mesmo disse:
              </p>
              <p>"Me sinto como um Viking!"</p>
            </article>
            <article className="testimonial">
              <h3>Mais 4 pessoas</h3>
              <p>
                Depoimentos variados de mais 4 pessoas que tiveram resultados em
                poucos dias.
              </p>
            </article>
            <article className="testimonial">
              <h3>Sergio Nascimento</h3>
              <p>
                Hoje quase 2 meses de protocolo selva saindo de 120 kg para 107
                kg, 13 kg a menos, mais disposicao, mais energia, sem sentir o
                corpo inchado, sem dores no corpo, hoje posso afirmar com toda a
                certeza que a dieta da selva mudou a minha vida.
              </p>
            </article>
          </div>
        </section>

        <section className="section reveal" id="protocolo">
          <div className="section-header">
            <p className="eyebrow">Protocolo Selva</p>
            <h2>Metodo brutal e eficaz para emagrecer e ganhar massa.</h2>
          </div>
          <div className="section-body">
            <p>
              Apresento a voce o PROTOCOLO SELVA - o metodo BRUTAL e EFICAZ para
              emagrecer e ganhar massa, sem academia, sem passar fome, comendo
              carne com gordura.
            </p>
            <p>Tres pilares:</p>
          </div>
          <div className="rituals-grid">
            <article className="ritual-card tilt">
              <div className="ritual-badge">Pilar 01</div>
              <h3>FOME ZERO</h3>
              <p>
                <strong>O que e:</strong> Comer alimentos ricos em gordura e
                proteina, satisfazendo o corpo.
              </p>
              <p>
                <strong>Resultado:</strong> Sem fome, energia constante.
              </p>
              <p>
                <strong>Como vai se sentir:</strong> Livre da ansiedade por
                comida.
              </p>
            </article>
            <article className="ritual-card tilt">
              <div className="ritual-badge">Pilar 02</div>
              <h3>QUEIMA MAXIMA</h3>
              <p>
                <strong>O que e:</strong> Estrategia de alimentacao que ativa a
                queima de gordura naturalmente.
              </p>
              <p>
                <strong>Resultado:</strong> Reducao de gordura mesmo em repouso.
              </p>
              <p>
                <strong>Como vai se sentir:</strong> Corpo mais leve, menos
                inchado, inflamado.
              </p>
            </article>
            <article className="ritual-card tilt">
              <div className="ritual-badge">Pilar 03</div>
              <h3>DISPOSICAO SELVAGEM</h3>
              <p>
                <strong>O que e:</strong> Reeducacao hormonal com alimentos
                certos.
              </p>
              <p>
                <strong>Resultado:</strong> Testosterona elevada, libido em alta,
                musculos mais definidos.
              </p>
              <p>
                <strong>Como vai se sentir:</strong> Confianca, vigor e
                masculinidade aflorada.
              </p>
            </article>
          </div>
        </section>

        <section className="section reveal" id="comparacao">
          <div className="section-header">
            <p className="eyebrow">Metodo tradicional vs Protocolo Selva</p>
            <h2>O corpo foi feito para sobrevivencia, nao para restricao.</h2>
          </div>
          <div className="plan-grid">
            <article className="plan-card">
              <h3>Dieta comum: 3% de sucesso.</h3>
              <p>Contagem de calorias, fome, academia exaustiva.</p>
              <p>Por que tao pouco?</p>
              <p>
                Porque o corpo humano nao foi feito pra restricao - foi feito
                pra sobrevivencia.
              </p>
              <p>
                Quando voce corta calorias e vive com fome, o corpo entra em
                modo defesa, desacelera o metabolismo, retem gordura e rouba sua
                energia.
              </p>
              <p>
                E como tentar domar um leao prendendo ele numa jaula - ele nao
                obedece, ele se apaga.
              </p>
            </article>
            <article className="plan-card plan-card-featured">
              <h3>Protocolo Selva: ate 87% de sucesso real.</h3>
              <p>Carne com gordura, energia maxima, corpo respondendo naturalmente.</p>
              <p>Aqui e o oposto:</p>
              <p>
                Voce da ao corpo o combustivel certo e ele entende o sinal -
                "estou seguro, posso queimar, posso crescer."
              </p>
              <p>
                O corpo para de se defender e comeca a funcionar como foi
                programado pela natureza.
              </p>
            </article>
          </div>
          <div className="section-body">
            <p>
              O corpo nao precisa de contagem de calorias, ele precisa de sinais
              certos.
            </p>
            <p>
              Cada refeicao no Protocolo Selva envia o comando de queimar gordura
              e gerar energia - e biologia, nao sacrificio.
            </p>
          </div>
        </section>

        <section className="section reveal" id="exemplos">
          <div className="section-header">
            <p className="eyebrow">Exemplos praticos</p>
            <h2>Voce tera exemplos praticos, como:</h2>
          </div>
          <div className="section-body">
            <ul className="bullet-list">
              <li>Cafe da manha: carne com gordura, energia alta</li>
              <li>Almoco: proteina animal, gordura boa, queima ativa</li>
              <li>Jantar: refeicao estrategica, hormonios equilibrados</li>
            </ul>
            <p>
              Imagine se seu corpo virasse um ima de forca, energia e resultado.
            </p>
            <p>
              O Protocolo Selva faz isso acontecer - mas as vagas sao poucas, e
              o momento e agora.
            </p>
            <p>
              Este curso e extensao de voce, e o que seu corpo ja quer fazer,
              mas nunca soube como.
            </p>
            <ul className="bullet-list">
              <li>Sem frescura</li>
              <li>Sem sofrimento</li>
              <li>So resultados</li>
            </ul>
          </div>
        </section>

        <section className="section reveal" id="recebe">
          <div className="section-header">
            <p className="eyebrow">O que voce recebe</p>
            <h2>O que voce recebe ao entrar no PROTOCOLO SELVA:</h2>
          </div>
          <div className="manifesto-grid">
            <article className="manifesto-card">
              <h3>TREINAMENTO SELVA</h3>
              <p>
                Mais de 20 aulas! Aprenda tudo sobre a Dieta da Selva, jejum
                estrategico e exposicao ao sol diario para maximizar queima de
                gordura, energia e testosterona.
              </p>
            </article>
            <article className="manifesto-card">
              <h3>REFEICOES E LISTA DE COMPRAS</h3>
              <p>
                Saiba exatamente como montar suas refeicoes, o que comprar e
                como comer sem passar fome, seguindo a dieta animal based.
              </p>
            </article>
            <article className="manifesto-card">
              <h3>COMUNIDADE SELVA</h3>
              <p>
                Grupo exclusivo para compartilhar resultados, tirar duvidas,
                trocar experiencias e manter a motivacao sempre la em cima.
              </p>
            </article>
            <article className="manifesto-card">
              <h3>SUPORTE DIRETO COMIGO</h3>
              <p>
                Tire suas duvidas e receba orientacao direta comigo para garantir
                que voce siga o metodo sem erros.
              </p>
            </article>
            <article className="manifesto-card">
              <h3>ATUALIZACOES FUTURAS</h3>
              <p>
                Conteudos novos, tecnicas e ajustes liberados constantemente para
                manter seus resultados sempre crescendo.
              </p>
            </article>
          </div>
        </section>

        <section className="section cta reveal" id="cta">
          <div className="cta-card">
            <div>
              <p className="eyebrow">As vagas sao LIMITADAS.</p>
              <h2>Nao entre se voce nao estiver pronto para resultados reais.</h2>
              <div className="section-body">
                <p>
                  Se voce nao agir agora, vai ter que esperar meses para proxima
                  abertura.
                </p>
                <p>Decida agora:</p>
                <p>
                  Clique abaixo e me chame no WhatsApp para entender como
                  funciona e comece a transformar seu corpo, energia e vida com
                  o PROTOCOLO SELVA.
                </p>
              </div>
            </div>
            <div className="cta-actions">
              <a
                href={WHATSAPP_LINK}
                className="btn btn-primary"
                data-magnetic="true"
              >
                CHAMAR NO WHATSAPP!
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <span className="logo">Protocolo Selva</span>
          <p>Energia real, corpo forte, vida intensa.</p>
        </div>
        <div className="footer-links">
          <a href="#historia">Historia</a>
          <a href="#protocolo">Protocolo</a>
          <a href="#cta">Contato</a>
        </div>
      </footer>
    </div>
  );
}
