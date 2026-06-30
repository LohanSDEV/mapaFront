/* =========================================================
   ARQUIVO: script.js
   Script único, compartilhado por todas as páginas do site.
   Responsável por: menu mobile, alternância de tema,
   animações de revelação, barras de habilidade animadas,
   filtro de projetos e validação do formulário de contato.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ----------------------------------------------------
     MENU DE NAVEGAÇÃO (versão mobile)
     Abre/fecha a lista de links ao clicar no botão
     "hambúrguer" e fecha o menu ao clicar em um link.
  ---------------------------------------------------- */
  var toggleBtn = document.querySelector(".menu-toggle");
  var navLinks = document.querySelector(".nav-links");
  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
      });
    });
  }

  /* ----------------------------------------------------
     ALTERNÂNCIA DE TEMA (claro/escuro)
     Lê a preferência salva no localStorage ao carregar
     a página e atualiza o armazenamento sempre que o
     usuário clicar no botão de alternância de tema.
  ---------------------------------------------------- */
  var themeBtn = document.querySelector(".theme-toggle");
  var savedTheme = localStorage.getItem("site-theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }
  if (themeBtn) {
    updateThemeLabel();
    themeBtn.addEventListener("click", function () {
      document.body.classList.toggle("light-mode");
      var isLight = document.body.classList.contains("light-mode");
      localStorage.setItem("site-theme", isLight ? "light" : "dark");
      updateThemeLabel();
    });
  }
  // Atualiza o texto do botão de acordo com o tema ativo
  function updateThemeLabel() {
    if (!themeBtn) return;
    var isLight = document.body.classList.contains("light-mode");
    themeBtn.textContent = isLight ? "modo-escuro()" : "modo-claro()";
  }

  /* ----------------------------------------------------
     ANIMAÇÃO DE REVELAÇÃO AO ROLAR A PÁGINA
     Usa IntersectionObserver para adicionar a classe
     "in-view" quando o elemento entra na tela, ativando
     a transição definida em CSS (.reveal).
  ---------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target); // anima apenas uma vez
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Navegadores sem suporte: exibe o conteúdo direto, sem animação
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ----------------------------------------------------
     BARRAS DE HABILIDADE ANIMADAS
     Cada barra possui um atributo data-level (0 a 100).
     Quando a barra entra na tela, sua largura é animada
     do estado inicial (0%) até o valor definido em CSS.
  ---------------------------------------------------- */
  var bars = document.querySelectorAll(".bar-fill");
  if (bars.length && "IntersectionObserver" in window) {
    var barObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var target = entry.target.getAttribute("data-level") || "0";
            entry.target.style.width = target + "%";
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach(function (bar) {
      barObserver.observe(bar);
    });
  }

  /* ----------------------------------------------------
     FILTRO DE PROJETOS (página Projetos)
     Mostra/esconde os cartões de projeto de acordo com
     a categoria selecionada nos botões de filtro.
  ---------------------------------------------------- */
  var filterBtns = document.querySelectorAll(".filter-btn");
  var projectCards = document.querySelectorAll(".project-card");
  if (filterBtns.length && projectCards.length) {
    // Exibe os cartões com uma pequena animação de entrada ao carregar
    projectCards.forEach(function (card) {
      setTimeout(function () {
        card.classList.add("show");
      }, 80);
    });

    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        // Marca apenas o botão clicado como ativo
        filterBtns.forEach(function (b) {
          b.classList.remove("active");
        });
        btn.classList.add("active");

        var filter = btn.getAttribute("data-filter");

        // Exibe somente os cartões que pertencem à categoria escolhida
        projectCards.forEach(function (card) {
          var cat = card.getAttribute("data-category");
          var matches = filter === "todos" || cat === filter;
          card.style.display = matches ? "" : "none";
          if (matches) {
            // Reinicia a animação de entrada do cartão filtrado
            card.classList.remove("show");
            requestAnimationFrame(function () {
              card.classList.add("show");
            });
          }
        });
      });
    });
  }

  /* ----------------------------------------------------
     VALIDAÇÃO DO FORMULÁRIO DE CONTATO
     Valida nome, e-mail, assunto e mensagem no momento
     do envio, exibindo uma mensagem de erro específica
     abaixo de cada campo inválido.
  ---------------------------------------------------- */
  var form = document.querySelector("#contact-form");
  if (form) {
    var status = document.querySelector("#form-status");

    // Marca/desmarca um campo como inválido e define a mensagem de erro
    function setError(fieldId, message) {
      var field = document.querySelector('[data-field="' + fieldId + '"]');
      var msg = field.querySelector(".msg");
      if (message) {
        field.classList.add("error");
        msg.textContent = message;
      } else {
        field.classList.remove("error");
        msg.textContent = "";
      }
    }

    // Validação simples de formato de e-mail via expressão regular
    function isValidEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault(); // impede o recarregamento da página

      var name = form.querySelector("#name").value.trim();
      var email = form.querySelector("#email").value.trim();
      var subject = form.querySelector("#subject").value.trim();
      var message = form.querySelector("#message").value.trim();

      var valid = true;

      // Nome: exige ao menos 3 caracteres
      if (name.length < 3) {
        setError("name", "Informe seu nome completo (mín. 3 caracteres).");
        valid = false;
      } else {
        setError("name", "");
      }

      // E-mail: precisa estar em um formato válido
      if (!isValidEmail(email)) {
        setError("email", "Informe um e-mail válido.");
        valid = false;
      } else {
        setError("email", "");
      }

      // Assunto: campo obrigatório
      if (subject.length < 3) {
        setError("subject", "Informe um assunto.");
        valid = false;
      } else {
        setError("subject", "");
      }

      // Mensagem: exige ao menos 10 caracteres
      if (message.length < 10) {
        setError("message", "Sua mensagem precisa ter ao menos 10 caracteres.");
        valid = false;
      } else {
        setError("message", "");
      }

      // Se algum campo for inválido, exibe aviso geral e interrompe o envio
      if (!valid) {
        status.textContent = "Verifique os campos destacados antes de enviar.";
        status.classList.remove("ok");
        status.classList.add("fail", "show");
        return;
      }

      // Formulário válido: exibe mensagem de sucesso e limpa os campos
      status.textContent =
        "Mensagem enviada com sucesso! Em breve retornarei o contato, " + name.split(" ")[0] + ".";
      status.classList.remove("fail");
      status.classList.add("ok", "show");
      form.reset();
    });
  }

  /* ----------------------------------------------------
     ANO ATUAL NO RODAPÉ
     Atualiza automaticamente o ano exibido no copyright.
  ---------------------------------------------------- */
  var yearEl = document.querySelector("#current-year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
