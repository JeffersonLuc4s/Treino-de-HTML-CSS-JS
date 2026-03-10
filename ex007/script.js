let botoes = document.querySelectorAll('button.botao')
let res = document.querySelector('div#res')
const igual = document.querySelector('button#igual')
const apagar = document.querySelector('button#apagar')

botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        res.innerHTML += botao.innerText
    })
});

apagar.addEventListener('click', () => {
    res.innerHTML = ''
})

igual.addEventListener('click', () => {
    let resultado = eval(res.innerText)
    res.innerHTML = resultado
})