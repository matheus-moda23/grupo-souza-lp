// =========================================================
// Landing Page – Grupo Souza
// Funcionalidades: menu mobile, link ativo no menu,
// máscara de telefone e validação do formulário.
// =========================================================

// ---------- Menu hambúrguer (celular) ----------
const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", function () {
  nav.classList.toggle("open");
  menuToggle.classList.toggle("open");

  const aberto = nav.classList.contains("open");
  menuToggle.setAttribute("aria-expanded", aberto);
});

// Fecha o menu ao clicar em qualquer link
const linksDoMenu = nav.querySelectorAll("a");

linksDoMenu.forEach(function (link) {
  link.addEventListener("click", function () {
    nav.classList.remove("open");
    menuToggle.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", false);
  });
});

// ---------- Destaca no menu a seção que está na tela ----------
// (a rolagem suave é feita pelo CSS: html { scroll-behavior: smooth; })
const secoes = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-link");

function atualizarLinkAtivo() {
  let secaoAtual = "inicio";

  secoes.forEach(function (secao) {
    const topo = secao.offsetTop - 120;
    if (window.scrollY >= topo) {
      secaoAtual = secao.id;
    }
  });

  // Se chegou ao final da página, marca "Contato"
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
    secaoAtual = "contato";
  }

  navLinks.forEach(function (link) {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + secaoAtual) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", atualizarLinkAtivo);
atualizarLinkAtivo();

// ---------- Máscara de telefone: (19) 99999-9999 ----------
const campoTelefone = document.getElementById("telefone");

function aplicarMascaraTelefone(valor) {
  // Mantém só os números (no máximo 11 dígitos)
  let numeros = valor.replace(/\D/g, "").substring(0, 11);

  if (numeros.length === 0) {
    return "";
  }
  if (numeros.length <= 2) {
    return "(" + numeros;
  }
  if (numeros.length <= 6) {
    return "(" + numeros.substring(0, 2) + ") " + numeros.substring(2);
  }
  if (numeros.length <= 10) {
    // Telefone fixo: (19) 3417-8190
    return "(" + numeros.substring(0, 2) + ") " + numeros.substring(2, 6) + "-" + numeros.substring(6);
  }
  // Celular: (19) 99999-9999
  return "(" + numeros.substring(0, 2) + ") " + numeros.substring(2, 7) + "-" + numeros.substring(7);
}

campoTelefone.addEventListener("input", function () {
  campoTelefone.value = aplicarMascaraTelefone(campoTelefone.value);
});

// ---------- Validação do formulário ----------
const formulario = document.getElementById("contactForm");
const mensagemSucesso = document.getElementById("formSuccess");

// Mostra a mensagem de erro embaixo do campo
function mostrarErro(campo, mensagem) {
  const grupo = campo.closest(".form-group");
  grupo.classList.add("error");
  grupo.querySelector(".error-message").textContent = mensagem;
}

// Remove o erro do campo
function limparErro(campo) {
  const grupo = campo.closest(".form-group");
  grupo.classList.remove("error");
  grupo.querySelector(".error-message").textContent = "";
}

// Verifica um formato básico de e-mail: algo@algo.algo
function emailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

function validarFormulario() {
  let valido = true;

  const nome = document.getElementById("nome");
  const telefone = document.getElementById("telefone");
  const email = document.getElementById("email");
  const tipo = document.getElementById("tipo");
  const bairro = document.getElementById("bairro");
  const finalidadeMarcada = document.querySelector('input[name="finalidade"]:checked');
  const primeiraFinalidade = document.querySelector('input[name="finalidade"]');

  // Nome
  if (nome.value.trim() === "") {
    mostrarErro(nome, "Informe seu nome completo.");
    valido = false;
  } else {
    limparErro(nome);
  }

  // Telefone (precisa ter 10 ou 11 dígitos)
  const digitosTelefone = telefone.value.replace(/\D/g, "").length;
  if (digitosTelefone === 0) {
    mostrarErro(telefone, "Informe seu telefone.");
    valido = false;
  } else if (digitosTelefone < 10) {
    mostrarErro(telefone, "Telefone incompleto.");
    valido = false;
  } else {
    limparErro(telefone);
  }

  // E-mail
  if (email.value.trim() === "") {
    mostrarErro(email, "Informe seu e-mail.");
    valido = false;
  } else if (!emailValido(email.value.trim())) {
    mostrarErro(email, "E-mail inválido.");
    valido = false;
  } else {
    limparErro(email);
  }

  // Tipo do imóvel
  if (tipo.value === "") {
    mostrarErro(tipo, "Selecione o tipo do imóvel.");
    valido = false;
  } else {
    limparErro(tipo);
  }

  // Finalidade
  if (finalidadeMarcada === null) {
    mostrarErro(primeiraFinalidade, "Escolha venda ou locação.");
    valido = false;
  } else {
    limparErro(primeiraFinalidade);
  }

  // Bairro
  if (bairro.value.trim() === "") {
    mostrarErro(bairro, "Informe o bairro do imóvel.");
    valido = false;
  } else {
    limparErro(bairro);
  }

  return valido;
}

formulario.addEventListener("submit", function (evento) {
  // Impede o envio real (não existe servidor neste projeto)
  evento.preventDefault();

  mensagemSucesso.hidden = true;

  if (validarFormulario()) {
    mensagemSucesso.hidden = false;
    formulario.reset();
    mensagemSucesso.scrollIntoView({ behavior: "smooth", block: "center" });
  } else {
    // Coloca o foco no primeiro campo com erro
    const primeiroErro = formulario.querySelector(".form-group.error input, .form-group.error select");
    if (primeiroErro) {
      primeiroErro.focus();
    }
  }
});

// Remove o erro assim que o usuário corrige o campo
formulario.querySelectorAll("input, select, textarea").forEach(function (campo) {
  const evento = campo.type === "radio" || campo.tagName === "SELECT" ? "change" : "input";

  campo.addEventListener(evento, function () {
    const grupo = campo.closest(".form-group");
    if (grupo && grupo.classList.contains("error")) {
      limparErro(campo);
    }
    mensagemSucesso.hidden = true;
  });
});
