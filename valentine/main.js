// Thay đổi nội dung búc thư ở đây
var letterContent = "Chúc em một ngày Valentine thật ngọt ngào và trọn vẹn. Cảm ơn em vì đã xuất hiện trong cuộc sống của anh, mang đến những tiếng cười, sự ấm áp và cả những khoảnh khắc mà anh luôn muốn lưu giữ thật lâu. Mong rằng hôm nay và cả những ngày sau này, chúng ta vẫn sẽ cùng nhau tạo thêm thật nhiều kỷ niệm đẹp. Happy Valentine’s Day ❤️"

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
