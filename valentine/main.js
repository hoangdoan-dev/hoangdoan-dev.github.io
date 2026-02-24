// Thay đổi nội dung búc thư ở đây
var letterContent = "Chúc Vũ Hà Linh một ngày Valentine không chỉ ngọt ngào mà còn thật ý nghĩa.

Chúc cậu luôn vững vàng với quan điểm của mình, luôn giữ được sự sắc sảo, tỉnh táo và tinh thần làm việc nghiêm túc đã tạo nên dấu ấn rất riêng. Mong rằng mọi nỗ lực thầm lặng phía sau mỗi nội dung cậu làm ra đều được nhìn nhận xứng đáng, và mọi dự định sắp tới đều tiến triển đúng như kỳ vọng, thậm chí vượt xa mong đợi.

Valentine là ngày của yêu thương, nhưng cũng là ngày để trân trọng hành trình mình đã đi qua. Chúc cậu luôn tin vào giá trị của bản thân, không ngừng phát triển và ngày càng thành công hơn nữa trên con đường mình đã chọn.

Chúc cậu một mùa Valentine đủ ấm để an tâm, đủ động lực để bứt phá và đủ niềm vui để mỉm cười thật nhiều."

// Tốc độ viết chữ. Số càng nhỏ tốc độ càng nhanh. 50 là tốc độ khá phù hợp
durationWrite = 50 

// Hiệu ứng gõ chữ

function effectWrite () {
    var boxLetter = document.querySelector(".letterContent")
    letterContentSplited = letterContent.split("")
    
    letterContentSplited.forEach((val, index) => {
        setTimeout(() => {
            boxLetter.innerHTML += val    
        }, durationWrite* index)
    })
}

window.addEventListener("load", () => {
    setTimeout(() => {
        document.querySelector(".container").classList.add("active")
    }, 500)
})

var openBtn = document.querySelector(".openBtn")
openBtn.addEventListener("click", () => {
    document.querySelector(".cardValentine").classList.add("active")
    document.querySelector(".container").classList.add("close")
})

var cardValentine = document.querySelector(".cardValentine")

cardValentine.addEventListener("click", () => {
    cardValentine.classList.toggle("open")

    if(cardValentine.className.indexOf("open") != -1) {
        setTimeout(effectWrite, 500)
    } else {
        setTimeout(() => {
            document.querySelector(".letterContent").innerHTML = ""
        }, 1000)
    }
})



