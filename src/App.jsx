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
        <div className="hero-icons" aria-hidden="true">
          <span className="hero-icon icon-body"></span>
          <span className="hero-icon icon-energy"></span>
          <span className="hero-icon icon-libido"></span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-alert" data-animate="true">
              <span>LEIA ANTES QUE SAIA DO AR</span>
            </div>
            <h1 data-animate="true">
              Transforme seu Corpo, Energia e Libido com uma dieta que a Indústria
              não quer que você saiba
            </h1>
            <p className="lead" data-animate="true">
              É 03:17 da manhã.
            </p>
          </div>
        </div>
      </header>

      <main>
        <section className="section reveal" id="historia">
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
            <p>
              ...não funcionou pra você. E olha, ninguém fala que isso pode estar te fazendo piorar ainda mais.
            </p>
          </div>
        </section>

        <div className="section-divider" aria-hidden="true"></div>

        <section className="section reveal" id="verdade">
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
            <p>
              Se você não está pronto para isso, feche esta página AGORA. Este método é para quem quer resultados reais, sem firulas.
            </p>
          </div>
        </section>

        <section className="section reveal">
          <div className="callout">
            <p>Jogue para vencer. Pare de perder tempo com métodos que nunca funcionaram.</p>
          </div>
        </section>

        <section className="section reveal" id="daniel">
          <div className="bio-grid">
            <div className="bio-copy">
              <div className="section-body story-stack">
                <p>Meu nome é Daniel Nou.</p>
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
            <div className="track-card">
              <p>Primeiros 30 dias: +10% de energia, primeira mudança visível no corpo</p>
            </div>
            <div className="track-card">
              <p>6 meses: -12kg, disposição em níveis que eu nunca imaginei</p>
            </div>
            <div className="track-card">
              <p>1 ano: corpo remodelado, testosterona normalizada, mental afiada</p>
            </div>
            <div className="track-card">
              <p>Hoje: energia infinita, libido alta, corpo forte, me sinto um viking</p>
            </div>
          </div>
          <div className="section-body story-stack">
            <p>
              Eu não estou vendendo algo que eu não usei. Estou vendendo um método que funcionou na minha vida e na vida de pessoas comuns como você.
            </p>
          </div>
        </section>

        <section className="section reveal" id="depoimentos">
          <div className="section-body story-stack">
            <p>Meus clientes vivem mudanças semelhantes:</p>
          </div>
          <div className="testimonials-grid">
            <article className="testimonial">
              <h3>Aumauri, 50 anos:</h3>
              <p>
                -16kg, disposição elevada, menos inchado, pré-diabetes eliminado, testosterona alta. Ele mesmo disse:
              </p>
              <p>"Me sinto como um Viking!"</p>
            </article>
            <article className="testimonial">
              <p>Depoimentos Variados de mais 4 pessoas que tiveram resultados em poucos dias</p>
            </article>
            <article className="testimonial">
              <h3>Sérgio Nascimento:</h3>
              <p>
                Hoje quase 2 meses de protocolo selva saindo de 120 kg para 107 kg, 13 kg a menos, mais disposição, mais energia, sem sentir o corpo inchado, sem dores no corpo, hoje posso afirmar com toda a certeza que a dieta da selva mudou a minha vida.
              </p>
            </article>
          </div>
        </section>

        <section className="section reveal" id="protocolo">
          <div className="section-body story-stack">
            <p>
              Apresento a você o PROTOCOLO SELVA — o método BRUTAL e EFICAZ para emagrecer e ganhar massa, sem academia, sem passar fome, comendo carne com gordura.
            </p>
            <p>Três pilares:</p>
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

        <section className="section reveal" id="comparacao">
          <div className="section-body story-stack">
            <p>Método tradicional vs Protocolo Selva</p>
            <p>Dieta comum: 3% de sucesso.</p>
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
            <p>Protocolo Selva: até 87% de sucesso real.</p>
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
          </div>
        </section>

        <section className="section reveal" id="exemplos">
          <div className="section-body story-stack">
            <p>Você terá exemplos práticos, como:</p>
            <div className="line-list">
              <p>Café da manhã: carne com gordura, energia alta</p>
              <p>Almoço: proteína animal, gordura boa, queima ativa</p>
              <p>Jantar: refeição estratégica, hormônios equilibrados</p>
            </div>
            <p>Imagine se seu corpo virasse um ímã de força, energia e resultado.</p>
            <p>
              O Protocolo Selva faz isso acontecer — mas as vagas são poucas, e o momento é agora.
            </p>
            <p>
              Este curso é extensão de você, é o que seu corpo já quer fazer, mas nunca soube como.
            </p>
            <div className="pill-list">
              <span>Sem frescura</span>
              <span>Sem sofrimento</span>
              <span>Só resultados</span>
            </div>
          </div>
        </section>

        <section className="section reveal" id="recebe">
          <div className="section-body story-stack">
            <p>O que você recebe ao entrar no PROTOCOLO SELVA:</p>
          </div>
          <div className="manifesto-grid">
            <article className="manifesto-card">
              <p>
                TREINAMENTO SELVA – Mais de 20 aulas! Aprenda tudo sobre a Dieta da Selva, jejum estratégico e exposição ao sol diário para maximizar queima de gordura, energia e testosterona.
              </p>
            </article>
            <article className="manifesto-card">
              <p>
                REFEIÇÕES E LISTA DE COMPRAS – Saiba exatamente como montar suas refeições, o que comprar e como comer sem passar fome, seguindo a dieta animal based.
              </p>
            </article>
            <article className="manifesto-card">
              <p>
                COMUNIDADE SELVA – Grupo exclusivo para compartilhar resultados, tirar dúvidas, trocar experiências e manter a motivação sempre lá em cima.
              </p>
            </article>
            <article className="manifesto-card">
              <p>
                SUPORTE DIRETO COMIGO – Tire suas dúvidas e receba orientação direta comigo para garantir que você siga o método sem erros.
              </p>
            </article>
            <article className="manifesto-card">
              <p>
                ATUALIZAÇÕES FUTURAS – Conteúdos novos, técnicas e ajustes liberados constantemente para manter seus resultados sempre crescendo.
              </p>
            </article>
          </div>
        </section>

        <section className="section cta reveal" id="cta">
          <div className="cta-card">
            <div className="section-body story-stack">
              <p>As vagas são LIMITADAS.</p>
              <p>Não entre se você não estiver pronto para resultados reais.</p>
              <p>
                Se você não agir agora, vai ter que esperar meses para próxima abertura.
              </p>
              <p>Decida agora:</p>
              <p>
                Clique abaixo e me chame no WhatsApp para entender como funciona e comece a transformar seu corpo, energia e vida com o PROTOCOLO SELVA.
              </p>
            </div>
            <div className="cta-actions">
              <a href={WHATSAPP_LINK} className="btn btn-primary" data-magnetic="true">
                👉 CHAMAR NO WHATSAPP! 👈
              </a>
            </div>
            <p className="attention">
              ATENÇÃO: Se você ainda quer contar calorias, passar fome e treinar sem parar, este metódo não é pra você.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
