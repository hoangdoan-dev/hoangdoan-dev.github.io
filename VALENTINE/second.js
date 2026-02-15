var flip = document.querySelector('.book-content');
var uno = document.querySelectorAll('.book');

var contZindex = 2;
var customZindex = 1;

// Debug CTA (báº­t/táº¯t log)
var DEBUG_CTA = true;

// ===== Page indicator (sá»‘ láº§n láº­t) =====
var currentFlip = 0; // Sá»‘ láº§n láº­t hiá»‡n táº¡i (0 = chÆ°a láº­t, chá»‰ má»Ÿ bÃ¬a)
var totalFlips = 3; // Tá»•ng sá»‘ láº§n láº­t cÃ³ ná»™i dung (khÃ´ng tÃ­nh láº§n láº­t Ä‘áº¿n bÃ¬a sau)
var pageIndicator = document.getElementById('pageIndicator');
var currentPageEl = document.getElementById('currentPage');

// HÃ m Ä‘á»ƒ cáº­p nháº­t totalFlips tá»« bÃªn ngoÃ i (tá»« load-valentine-data.js)
function setTotalFlips(count) {
    totalFlips = count;
    // Cáº­p nháº­t totalPages indicator náº¿u chÆ°a Ä‘Æ°á»£c cáº­p nháº­t
    const totalPagesEl = document.getElementById('totalPages');
    if (totalPagesEl && totalPagesEl.textContent !== String(count)) {
        totalPagesEl.textContent = count;
    }
}

// Expose hÃ m Ä‘á»ƒ cÃ³ thá»ƒ gá»i tá»« bÃªn ngoÃ i
if (typeof window !== 'undefined') {
    window.setTotalFlips = setTotalFlips;
    window.totalFlips = totalFlips; // Expose biáº¿n Ä‘á»ƒ cÃ³ thá»ƒ Ä‘á»c
}

function updatePageIndicator(flip) {
	currentFlip = flip;
	if (currentPageEl) {
		currentPageEl.textContent = currentFlip;
	}
	// Chá»‰ hiá»‡n indicator sau láº§n láº­t Ä‘áº§u tiÃªn (khi flip >= 1)
	if (pageIndicator) {
		if (currentFlip >= 1) {
			// Hiá»‡n indicator sau khi láº­t xong
			setTimeout(function(){
				pageIndicator.classList.add('show');
			}, 600);
		} else {
			// áº¨n indicator khi chÆ°a láº­t (chá»‰ má»Ÿ bÃ¬a)
			pageIndicator.classList.remove('show');
		}
	}
}


// HÃ m quáº£n lÃ½ dá»‹ch book khi láº­t tá» cuá»‘i
function shiftBookFinal(direction, delay) {
	delay = delay || 500;
	setTimeout(function(){
		if (direction === 'right') {
			// Dá»‹ch thÃªm 128px sang pháº£i
			flip.classList.remove("trnsf-reset", "trnsf");
			flip.classList.add("trnsf-final");
		} else if (direction === 'left') {
			// Dá»‹ch láº¡i vá» vá»‹ trÃ­ trnsf (vá»‹ trÃ­ khi má»Ÿ bÃ¬a)
			flip.classList.remove("trnsf-final", "trnsf-reset");
			flip.classList.add("trnsf");
		}
	}, delay);
}

// ===== Final CTA: doubleHeart vÃ  cupids trÆ°á»£t xuá»‘ng, sau Ä‘Ã³ hiá»‡n giftBox riÃªng =====
var bookContent = document.querySelector('.book-content');
var doubleHeart = document.getElementById('doubleHeart');
var doubleHeartGlow = document.getElementById('doubleHeartGlow');
var giftBox = document.getElementById('giftBox');
var noFinalGiftImg = document.getElementById('noFinalGiftImg');
var giftBoxGlow = document.getElementById('giftBoxGlow');
var doubleHeartOriginalSrc = doubleHeart ? doubleHeart.getAttribute('src') : null;
var finalCtaTimers = [];
var dropAnim = null;

// ===== Cupids converge: leftCupid vÃ  rightCupid trÆ°á»£t chÃ©o vá» giá»¯a =====
var leftCupid = document.getElementById('leftCupid');
var rightCupid = document.getElementById('rightCupid');
var leftCupidAnim = null;
var rightCupidAnim = null;
var cupidsConverged = false;
var doubleHeartDropped = false;

function ctaSetTimeout(fn, ms) {
	var id = setTimeout(fn, ms);
	finalCtaTimers.push(id);
	return id;
}
function clearFinalCtaTimers() {
	while (finalCtaTimers.length) {
		clearTimeout(finalCtaTimers.pop());
	}
}

function clearDropAnim() {
	try {
		if (dropAnim) dropAnim.cancel();
	} catch (e) {}
	dropAnim = null;
}

function clearCupidsAnims() {
	try {
		if (leftCupidAnim) leftCupidAnim.cancel();
		if (rightCupidAnim) rightCupidAnim.cancel();
	} catch (e) {}
	leftCupidAnim = null;
	rightCupidAnim = null;
	cupidsConverged = false;
}

function resetFinalCta() {
	clearFinalCtaTimers();
	clearDropAnim();
	clearCupidsAnims();
	cupidsConverged = false;
	doubleHeartDropped = false;
	
	if (doubleHeart) {
		doubleHeart.classList.remove('cta-drop', 'cta-heart', 'fade-out', 'show');
		// clear inline fade overrides
		doubleHeart.style.opacity = '';
		doubleHeart.style.transition = '';
		doubleHeart.style.display = '';
		if (doubleHeartOriginalSrc) doubleHeart.setAttribute('src', doubleHeartOriginalSrc);
	}
	if (doubleHeartGlow) {
		doubleHeartGlow.classList.remove('show');
		doubleHeartGlow.style.display = 'none';
	}
	
	// Reset cupids vá» vá»‹ trÃ­ ban Ä‘áº§u
	if (leftCupid) {
		leftCupid.style.display = '';
		leftCupid.style.left = '';
		leftCupid.style.top = '';
		leftCupid.style.right = '';
		leftCupid.style.width = '';
		leftCupid.style.height = '';
		leftCupid.style.transform = '';
		leftCupid.style.transition = '';
		leftCupid.style.opacity = '';
		leftCupid.classList.remove('cupid-converge', 'cupid-fade-out');
	}
	if (rightCupid) {
		rightCupid.style.display = '';
		rightCupid.style.left = '';
		rightCupid.style.top = '';
		rightCupid.style.right = '';
		rightCupid.style.width = '';
		rightCupid.style.height = '';
		rightCupid.style.transform = '';
		rightCupid.style.transition = '';
		rightCupid.style.opacity = '';
		rightCupid.classList.remove('cupid-converge', 'cupid-fade-out');
	}
	
	// áº¨n giftBox vÃ  noFinalGiftImg
	if (giftBox) {
		giftBox.style.display = 'none';
		giftBox.classList.remove('show');
		giftBox.style.opacity = '';
		giftBox.style.transform = '';
		giftBox.style.transition = '';
	}
	if (noFinalGiftImg) {
		noFinalGiftImg.style.display = 'none';
		noFinalGiftImg.classList.remove('show');
		noFinalGiftImg.style.opacity = '';
		noFinalGiftImg.style.transform = '';
		noFinalGiftImg.style.transition = '';
		noFinalGiftImg.style.position = '';
		noFinalGiftImg.style.top = '';
		noFinalGiftImg.style.left = '';
		noFinalGiftImg.style.width = '';
		noFinalGiftImg.style.zIndex = '';
	}
	if (giftBoxGlow) {
		giftBoxGlow.style.display = 'none';
		giftBoxGlow.classList.remove('show');
		giftBoxGlow.style.opacity = '';
	}
	
	document.body.classList.remove('final-cta');
}

function showGiftBox() {
	// Báº£n ghi cÃ³ mÃ³n quÃ  cuá»‘i enable=false â†’ hiá»ƒn thá»‹ no_finalgift.gif, khÃ´ng hiá»ƒn thá»‹ gift-box
	var hasFinalGift = typeof window.hasFinalGift !== 'undefined' ? window.hasFinalGift : true;

	if (hasFinalGift && giftBox) {
		// Äáº·t giftBox á»Ÿ giá»¯a mÃ n hÃ¬nh, chuáº©n bá»‹ fade-in + scale-up
		giftBox.style.display = 'block';
		giftBox.style.position = 'fixed';
		giftBox.style.top = '50%';
		giftBox.style.left = '50%';
		giftBox.style.width = '320px';
		giftBox.style.height = 'auto';
		giftBox.style.zIndex = '120';
		giftBox.style.opacity = '0';
		giftBox.style.transform = 'translate(-50%, -50%) scale(0.5)';
		giftBox.style.transition = 'none';
		giftBox.style.cursor = 'pointer';
		giftBox.style.pointerEvents = 'auto';
		void giftBox.offsetWidth;

		giftBox.style.transition = 'opacity 1.5s ease, transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
		requestAnimationFrame(function(){
			requestAnimationFrame(function(){
				ctaSetTimeout(function(){
					giftBox.classList.add('show');
					giftBox.style.opacity = '1';
					giftBox.style.transform = 'translate(-50%, -50%) scale(1)';
				}, 50);
			});
		});

		if (giftBoxGlow) {
			giftBoxGlow.style.display = 'block';
			giftBoxGlow.style.position = 'fixed';
			giftBoxGlow.style.top = '50%';
			giftBoxGlow.style.left = '50%';
			giftBoxGlow.style.zIndex = '119';
			giftBoxGlow.style.opacity = '0';
			giftBoxGlow.style.transition = 'opacity 0.8s ease';
			void giftBoxGlow.offsetWidth;
			ctaSetTimeout(function(){
				giftBoxGlow.classList.add('show');
				giftBoxGlow.style.opacity = '1';
			}, 50);
		}
		return;
	}

	// enable=false: hiá»ƒn thá»‹ no_finalgift.gif (khÃ´ng click vÃ o load final)
	if (noFinalGiftImg) {
		noFinalGiftImg.style.display = 'block';
		noFinalGiftImg.style.position = 'fixed';
		noFinalGiftImg.style.top = '50%';
		noFinalGiftImg.style.left = '50%';
		noFinalGiftImg.style.width = 'min(520px, 85vw)';
		noFinalGiftImg.style.height = 'auto';
		noFinalGiftImg.style.zIndex = '120';
		noFinalGiftImg.style.opacity = '0';
		noFinalGiftImg.style.transform = 'translate(-50%, -50%) scale(0.5)';
		noFinalGiftImg.style.transition = 'none';
		noFinalGiftImg.style.pointerEvents = 'none';
		void noFinalGiftImg.offsetWidth;

		noFinalGiftImg.style.transition = 'opacity 1.5s ease, transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
		requestAnimationFrame(function(){
			requestAnimationFrame(function(){
				ctaSetTimeout(function(){
					noFinalGiftImg.classList.add('show');
					noFinalGiftImg.style.opacity = '1';
					noFinalGiftImg.style.transform = 'translate(-50%, -50%) scale(1)';
				}, 50);
			});
		});
	}
}

function startCupidsConverge() {
	if (!leftCupid || !rightCupid) return;

	// Reset Ä‘á»ƒ cháº¡y láº¡i animation tá»« Ä‘áº§u
	clearCupidsAnims();

	// ===== Left Cupid: tá»« gÃ³c trÃªn trÃ¡i â†’ trÆ°á»£t chÃ©o xuá»‘ng vá» bÃªn pháº£i â†’ giá»¯a mÃ n hÃ¬nh =====
	var leftRect = leftCupid.getBoundingClientRect();
	var rightRect = rightCupid.getBoundingClientRect();
	
	// Vá»‹ trÃ­ giá»¯a mÃ n hÃ¬nh (cÃ¹ng vá»›i double heart)
	var centerX = window.innerWidth / 2;
	var centerY = window.innerHeight / 2;
	
	// Left cupid: tá»« gÃ³c trÃªn trÃ¡i â†’ giá»¯a mÃ n hÃ¬nh (trÆ°á»£t chÃ©o xuá»‘ng vá» bÃªn pháº£i)
	var leftDx = centerX - leftRect.left - leftRect.width / 2;
	var leftDy = centerY - leftRect.top - leftRect.height / 2;
	
	// Right cupid: tá»« gÃ³c trÃªn pháº£i â†’ giá»¯a mÃ n hÃ¬nh (trÆ°á»£t chÃ©o xuá»‘ng vá» bÃªn trÃ¡i)
	var rightDx = centerX - rightRect.left - rightRect.width / 2;
	var rightDy = centerY - rightRect.top - rightRect.height / 2;

	// Freeze vá»‹ trÃ­ hiá»‡n táº¡i cho leftCupid
	leftCupid.style.left = leftRect.left + 'px';
	leftCupid.style.top = leftRect.top + 'px';
	leftCupid.style.right = '';
	leftCupid.style.width = leftRect.width + 'px';
	leftCupid.style.height = leftRect.height + 'px';
	leftCupid.style.transform = 'translate3d(0,0,0)';
	leftCupid.style.transition = 'none';
	leftCupid.classList.add('cupid-converge');
	void leftCupid.offsetWidth;

	// Freeze vá»‹ trÃ­ hiá»‡n táº¡i cho rightCupid
	rightCupid.style.right = '';
	rightCupid.style.left = rightRect.left + 'px';
	rightCupid.style.top = rightRect.top + 'px';
	rightCupid.style.width = rightRect.width + 'px';
	rightCupid.style.height = rightRect.height + 'px';
	rightCupid.style.transform = 'translate3d(0,0,0)';
	rightCupid.style.transition = 'none';
	rightCupid.classList.add('cupid-converge');
	void rightCupid.offsetWidth;

	// Animate cáº£ hai cÃ¹ng lÃºc
	var animDuration = 1800; // HÆ¡i lÃ¢u hÆ¡n double heart má»™t chÃºt Ä‘á»ƒ táº¡o hiá»‡u á»©ng Ä‘áº¹p
	var animEasing = 'cubic-bezier(0.16, 1, 0.3, 1)';
	
	try {
		// Left cupid animation
		leftCupidAnim = leftCupid.animate(
			[
				{ transform: 'translate3d(0,0,0)' },
				{ transform: 'translate3d(' + leftDx + 'px,' + leftDy + 'px,0)' }
			],
			{ duration: animDuration, easing: animEasing, fill: 'forwards' }
		);

		// Right cupid animation
		rightCupidAnim = rightCupid.animate(
			[
				{ transform: 'translate3d(0,0,0)' },
				{ transform: 'translate3d(' + rightDx + 'px,' + rightDy + 'px,0)' }
			],
			{ duration: animDuration, easing: animEasing, fill: 'forwards' }
		);

		// Äáº¿m sá»‘ animation hoÃ n thÃ nh
		var completedCount = 0;
		var checkAllComplete = function() {
			completedCount++;
			if (completedCount === 2) {
				cupidsConverged = true;
				// Cleanup freeze styles
				leftCupid.style.left = '';
				leftCupid.style.top = '';
				leftCupid.style.width = '';
				leftCupid.style.height = '';
				leftCupid.style.transform = '';
				leftCupid.style.transition = '';
				
				rightCupid.style.left = '';
				rightCupid.style.top = '';
				rightCupid.style.width = '';
				rightCupid.style.height = '';
				rightCupid.style.transform = '';
				rightCupid.style.transition = '';
				
				// Äáº·t vá» giá»¯a mÃ n hÃ¬nh báº±ng CSS
				leftCupid.style.left = '50%';
				leftCupid.style.top = '50%';
				leftCupid.style.transform = 'translate(-50%, -50%)';
				
				rightCupid.style.left = '50%';
				rightCupid.style.top = '50%';
				rightCupid.style.transform = 'translate(-50%, -50%)';
				
				// Chá»‰ clear tham chiáº¿u animation, KHÃ”NG gá»i clearCupidsAnims() vÃ¬ nÃ³ reset cupidsConverged = false
				leftCupidAnim = null;
				rightCupidAnim = null;
				
				// KHÃ”NG áº©n cupids ngay, Ä‘á»£i fade-out cÃ¹ng doubleHeart
				checkAndFadeOutAll();
			}
		};

		leftCupidAnim.onfinish = checkAllComplete;
		rightCupidAnim.onfinish = checkAllComplete;
	} catch (e) {
		// Fallback náº¿u WAAPI khÃ´ng cÃ³
		if (DEBUG_CTA) console.warn('cupids converge WAAPI failed, using fallback:', e);
		cupidsConverged = true;
		// KHÃ”NG áº©n cupids ngay, Ä‘á»£i fade-out cÃ¹ng doubleHeart
		checkAndFadeOutAll();
	}
}

function checkAndFadeOutAll() {
	// Chá» cáº£ cupids vÃ  doubleHeart Ä‘á»u trÆ°á»£t xong rá»“i má»›i fade-out Ä‘á»“ng thá»i
	// Kiá»ƒm tra: cupids Ä‘Ã£ tá»¥ há»£p xong VÃ€ doubleHeart Ä‘Ã£ trÆ°á»£t xong
	if (cupidsConverged && doubleHeartDropped && !dropAnim) {
		// Fade-out cáº£ 3 cÃ¹ng lÃºc
		fadeOutAllTogether();
	}
}

function fadeOutAllTogether() {
	// Fade-out cáº£ 3: leftCupid, rightCupid, vÃ  doubleHeart cÃ¹ng lÃºc
	var fadeDuration = 800; // 0.8s
	
	if (leftCupid) {
		leftCupid.style.transition = 'opacity ' + (fadeDuration / 1000) + 's ease';
		leftCupid.style.opacity = '0';
		leftCupid.classList.add('cupid-fade-out');
	}
	if (rightCupid) {
		rightCupid.style.transition = 'opacity ' + (fadeDuration / 1000) + 's ease';
		rightCupid.style.opacity = '0';
		rightCupid.classList.add('cupid-fade-out');
	}
	if (doubleHeart) {
		doubleHeart.style.transition = 'opacity ' + (fadeDuration / 1000) + 's ease';
		doubleHeart.style.opacity = '0';
	}
	if (doubleHeartGlow) {
		doubleHeartGlow.style.transition = 'opacity ' + (fadeDuration / 1000) + 's ease';
		doubleHeartGlow.style.opacity = '0';
	}
	
	// Sau khi fade-out xong, áº©n hoÃ n toÃ n vÃ  hiá»‡n giftBox
	ctaSetTimeout(function(){
		if (leftCupid) {
			leftCupid.style.display = 'none';
		}
		if (rightCupid) {
			rightCupid.style.display = 'none';
		}
		if (doubleHeart) {
			doubleHeart.style.display = 'none';
		}
		if (doubleHeartGlow) {
			doubleHeartGlow.style.display = 'none';
		}
		
		// Hiá»‡n giftBox sau khi fade-out xong
		showGiftBox();
	}, fadeDuration + 50); // Äá»£i fade out animation xong + buffer
}

function startFinalCtaDrop() {
	if (!doubleHeart) return;
	document.body.classList.add('final-cta');

	// reset Ä‘á»ƒ cháº¡y láº¡i animation tá»« Ä‘áº§u
	clearFinalCtaTimers();
	clearDropAnim();
	doubleHeart.classList.remove('cta-drop', 'cta-gift', 'cta-heart', 'fade-out', 'show');
	if (doubleHeartOriginalSrc) doubleHeart.setAttribute('src', doubleHeartOriginalSrc);
	// clear inline fade overrides
	doubleHeart.style.opacity = '';
	doubleHeart.style.transition = '';

	// ===== Slide to center dá»±a trÃªn kÃ­ch thÆ°á»›c/position Ä‘ang hiá»ƒn thá»‹ =====
	var rect = doubleHeart.getBoundingClientRect();
	var targetLeft = (window.innerWidth - rect.width) / 2;
	var targetTop = (window.innerHeight - rect.height) / 2;
	var dx = targetLeft - rect.left;
	var dy = targetTop - rect.top;

	// Freeze Ä‘Ãºng vá»‹ trÃ­ hiá»‡n táº¡i báº±ng px + size Ä‘ang hiá»ƒn thá»‹
	doubleHeart.style.left = rect.left + 'px';
	doubleHeart.style.top = rect.top + 'px';
	doubleHeart.style.width = rect.width + 'px';
	doubleHeart.style.height = rect.height + 'px';
	doubleHeart.style.transform = 'translate3d(0,0,0)';
	doubleHeart.style.transition = 'none';
	void doubleHeart.offsetWidth;


	// Animate báº±ng transform (mÆ°á»£t) nhÆ°ng má»‘c tÃ­nh tá»« size/pos tháº­t
	try {
		dropAnim = doubleHeart.animate(
			[
				{ transform: 'translate3d(0,0,0)' },
				{ transform: 'translate3d(' + dx + 'px,' + dy + 'px,0)' }
			],
			{ duration: 1700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' }
		);
		dropAnim.onfinish = function(){
			// Cleanup freeze styles Ä‘á»ƒ quay vá» dÃ¹ng CSS class (top/left 50%)
			doubleHeart.style.left = '';
			doubleHeart.style.top = '';
			doubleHeart.style.width = '';
			doubleHeart.style.height = '';
			doubleHeart.style.transform = '';
			doubleHeart.style.transition = '';
			clearDropAnim();
			
			// ÄÃ¡nh dáº¥u doubleHeart Ä‘Ã£ trÆ°á»£t xong
			doubleHeartDropped = true;
			
			// Äáº·t doubleHeart á»Ÿ giá»¯a mÃ n hÃ¬nh (Ä‘á»ƒ fade-out sau)
			doubleHeart.style.left = '50%';
			doubleHeart.style.top = '50%';
			doubleHeart.style.transform = 'translate(-50%, -50%)';
			doubleHeart.classList.add('cta-heart');
			
			// Kiá»ƒm tra xem cupids Ä‘Ã£ xong chÆ°a, náº¿u rá»“i thÃ¬ fade-out cÃ¹ng nhau
			checkAndFadeOutAll();
		};
	} catch (e) {
		// Fallback: náº¿u WAAPI khÃ´ng cÃ³
		if (DEBUG_CTA) console.warn('drop(slide) WAAPI failed, using fallback:', e);
		doubleHeartDropped = true;
		// Äáº·t doubleHeart á»Ÿ giá»¯a mÃ n hÃ¬nh
		if (doubleHeart) {
			doubleHeart.style.left = '50%';
			doubleHeart.style.top = '50%';
			doubleHeart.style.transform = 'translate(-50%, -50%)';
			doubleHeart.classList.add('cta-heart');
		}
		checkAndFadeOutAll();
	}
}

// Click vÃ o gift-box Ä‘á»ƒ load final gift vÃ o intro (chá»‰ khi cÃ³ mÃ³n quÃ  cuá»‘i)
if (giftBox) {
	giftBox.addEventListener('click', function(){
		if (typeof window.hasFinalGift !== 'undefined' && !window.hasFinalGift) return;
		loadFinalScreen();
	});
}

// Loading progress animation
function startLoadingProgress() {
	var progressFill = document.getElementById('loadingProgressFill');
	if (!progressFill) return;
	
	// Reset progress
	progressFill.style.width = '0%';
	
	// Simulate progress (0% -> 90% trong lÃºc load) - nhanh hÆ¡n ná»¯a
	var progress = 0;
	var progressInterval = setInterval(function() {
		progress += Math.random() * 30 + 20; // TÄƒng ngáº«u nhiÃªn 20-50% (nhanh hÆ¡n)
		if (progress > 90) {
			progress = 90; // Dá»«ng á»Ÿ 90% chá» final.js load xong
			clearInterval(progressInterval);
		}
		progressFill.style.width = progress + '%';
	}, 30); // Giáº£m tá»« 50ms xuá»‘ng 30ms
	
	// LÆ°u interval Ä‘á»ƒ cÃ³ thá»ƒ clear sau
	window.loadingProgressInterval = progressInterval;
}

function completeLoadingProgress() {
	var progressFill = document.getElementById('loadingProgressFill');
	if (progressFill) {
		// HoÃ n thÃ nh 100%
		progressFill.style.width = '100%';
		// Clear interval náº¿u cÃ²n cháº¡y
		if (window.loadingProgressInterval) {
			clearInterval(window.loadingProgressInterval);
			window.loadingProgressInterval = null;
		}
	}
}

// Load final screen (HTML Ä‘Ã£ cÃ³ sáºµn trong index.html, chá»‰ cáº§n load JS)
function loadFinalScreen() {
	var finalScreen = document.getElementById('finalScreen');
	var loadingScreen = document.getElementById('finalLoadingScreen');
	if (!finalScreen) return;
	
	// Hiá»‡n loading screen trÆ°á»›c
	if (loadingScreen) {
		loadingScreen.style.display = 'flex';
		setTimeout(function(){
			loadingScreen.classList.add('show');
			// Báº¯t Ä‘áº§u animation progress bar
			startLoadingProgress();
		}, 30); // Giáº£m tá»« 50ms xuá»‘ng 30ms
	}
	
	// áº¨n táº¥t cáº£ mÃ n hÃ¬nh khÃ¡c
	var introScreen = document.getElementById('introScreen');
	var secondScreen = document.getElementById('secondScreen');
	if (introScreen) introScreen.style.display = 'none';
	if (secondScreen) secondScreen.style.display = 'none';
	
	// Set data cho final.js (cáº§n thiáº¿t cho final.js)
	if (!window.dataMemoryHeartLoveLoom) {
		window.dataMemoryHeartLoveLoom = {
			"template": "birthday-v2",
			"data": {
				"title": "Feliz Mes, Mi Amor Eterno",
				"messages": [],
				"images": ["../assets/images/final/anh.jpg"],
				"heartColor": "#ff1493"
			}
		};
	}
	
	// Patch document.body.appendChild Ä‘á»ƒ append canvas vÃ o finalScreen thay vÃ¬ body
	var originalAppendChild = document.body.appendChild;
	var canvasAppended = false;
	var canvasElement = null;
	
	document.body.appendChild = function(element) {
		// Náº¿u lÃ  canvas vÃ  chÆ°a append vÃ o finalScreen
		if (element.tagName === 'CANVAS' && !canvasAppended) {
			canvasAppended = true;
			canvasElement = element;
			// Äáº£m báº£o canvas cÃ³ style Ä‘Ãºng
			element.style.position = 'fixed';
			element.style.top = '0';
			element.style.left = '0';
			element.style.width = '100%';
			element.style.height = '100%';
			element.style.zIndex = '1';
			element.style.display = 'block';
			finalScreen.appendChild(element);
			return element;
		}
		// CÃ¡c element khÃ¡c append vÃ o body nhÆ° bÃ¬nh thÆ°á»ng
		return originalAppendChild.call(document.body, element);
	};
	
	// Kiá»ƒm tra Three.js CDN trÆ°á»›c khi load final.js
	fetch('https://cdn.jsdelivr.net/npm/three@0.157.0/build/three.module.js', { method: 'HEAD' })
		.then(function(response) {
			if (!response.ok) {
				throw new Error('CDN not accessible: ' + response.status);
			}
			loadFinalJS();
		})
		.catch(function(error) {
			// Váº«n thá»­ load, cÃ³ thá»ƒ cache Ä‘Ã£ cÃ³
			loadFinalJS();
		});
	
	function loadFinalJS() {
		// Load final.js (module)
		var finalScript = document.createElement('script');
		finalScript.type = 'module';
		finalScript.src = '../final_gift/final.js';
		
		var scriptLoadTimeout = setTimeout(function() {
			alert('Hiá»‡u á»©ng 3D Ä‘ang táº£i cháº­m. Vui lÃ²ng kiá»ƒm tra káº¿t ná»‘i máº¡ng vÃ  thá»­ láº¡i.');
		}, 15000);
		
		// Load final.js sau khi inline scripts Ä‘Ã£ cháº¡y
		finalScript.onload = function() {
			clearTimeout(scriptLoadTimeout);
			
			// Restore original appendChild sau khi canvas Ä‘Ã£ Ä‘Æ°á»£c append
			if (canvasAppended) {
				document.body.appendChild = originalAppendChild;
			}
			
			// Äáº£m báº£o canvas Ä‘Æ°á»£c resize Ä‘Ãºng náº¿u renderer Ä‘Ã£ Ä‘Æ°á»£c táº¡o
			if (canvasElement && window.innerWidth && window.innerHeight) {
				// TÃ¬m renderer tá»« Three.js (náº¿u cÃ³)
				var canvas = finalScreen.querySelector('canvas');
				if (canvas && canvas.width !== window.innerWidth) {
					// Trigger resize event Ä‘á»ƒ final.js resize renderer
					window.dispatchEvent(new Event('resize'));
				}
			}
			
			// HoÃ n thÃ nh progress bar
			completeLoadingProgress();
			
			// áº¨n loading ngay láº­p tá»©c
			if (loadingScreen) {
				loadingScreen.classList.remove('show');
				loadingScreen.style.display = 'none';
			}
		};
		
		finalScript.onerror = function(e) {
			clearTimeout(scriptLoadTimeout);
			
			// Restore original appendChild
			document.body.appendChild = originalAppendChild;
			
			// Hiá»‡n thÃ´ng bÃ¡o lá»—i chi tiáº¿t
			var errorMsg = 'KhÃ´ng thá»ƒ táº£i hiá»‡u á»©ng 3D.\n\n';
			errorMsg += 'NguyÃªn nhÃ¢n cÃ³ thá»ƒ:\n';
			errorMsg += '- Káº¿t ná»‘i máº¡ng yáº¿u\n';
			errorMsg += '- TrÃ¬nh duyá»‡t cháº·n script\n';
			errorMsg += '- PhiÃªn báº£n iOS/Safari quÃ¡ cÅ©\n\n';
			errorMsg += 'Vui lÃ²ng:\n';
			errorMsg += '1. Kiá»ƒm tra káº¿t ná»‘i WiFi/4G\n';
			errorMsg += '2. Táº£i láº¡i trang (kÃ©o xuá»‘ng)\n';
			errorMsg += '3. Thá»­ trÃ¬nh duyá»‡t khÃ¡c (Chrome/Safari)';
			
			alert(errorMsg);
		};
		
		document.body.appendChild(finalScript);
	}
	
	// Hiá»‡n finalScreen ngay (HTML Ä‘Ã£ cÃ³ sáºµn)
	finalScreen.classList.add('is-visible');
	finalScreen.setAttribute('aria-hidden', 'false');
}

function showFinalCta(show, delay) {
	delay = delay || 0;
	setTimeout(function(){
		if (show) {
			clearFinalCtaTimers();
			// áº¨n page indicator khi hiá»‡n gift box
			if (pageIndicator) {
				pageIndicator.classList.remove('show');
			}
			// áº¨n sÃ¡ch trÆ°á»›c
			if (bookContent) {
				bookContent.classList.add('hide-for-gift');

				// Báº¯t Ä‘áº§u trÆ°á»£t xuá»‘ng NGAY khi fade-out sÃ¡ch xong (khÃ´ng delay thá»§ cÃ´ng)
				var started = false;
				var startDropOnce = function(){
					if (started) return;
					started = true;
					// Báº¯t Ä‘áº§u cáº£ cupids vÃ  double heart cÃ¹ng lÃºc
					startCupidsConverge();
					startFinalCtaDrop();
				};
				var onEnd = function(ev){
					if (ev && ev.propertyName && ev.propertyName !== 'opacity') return;
					bookContent.removeEventListener('transitionend', onEnd);
					startDropOnce();
				};
				bookContent.addEventListener('transitionend', onEnd);
				// Fallback náº¿u transitionend khÃ´ng fire
				ctaSetTimeout(function(){
					bookContent.removeEventListener('transitionend', onEnd);
					startDropOnce();
				}, 900);
			} else {
				// Báº¯t Ä‘áº§u cáº£ cupids vÃ  double heart cÃ¹ng lÃºc
				startCupidsConverge();
				startFinalCtaDrop();
			}
		} else {
			// áº¨n CTA vÃ  hiá»‡n láº¡i sÃ¡ch
			resetFinalCta();
			// Äá»£i CTA fade-out xong rá»“i má»›i hiá»‡n sÃ¡ch láº¡i cho mÆ°á»£t
			setTimeout(function(){
				if (bookContent) bookContent.classList.remove('hide-for-gift');
				// Hiá»‡n láº¡i page indicator
				if (pageIndicator) {
					pageIndicator.classList.add('show');
				}
			}, 850);
		}
	}, delay);
}

// HÃ m Ä‘á»ƒ khá»Ÿi táº¡o event listeners cho cÃ¡c book elements
function initializeBookFlip() {
	// Láº¥y láº¡i danh sÃ¡ch book elements (cÃ³ thá»ƒ Ä‘Ã£ Ä‘Æ°á»£c táº¡o Ä‘á»™ng)
	uno = document.querySelectorAll('.book');
	flip = document.querySelector('.book-content');
	
	// Reset z-index counters
	contZindex = 2;
	customZindex = 1;
	
	
	for (var i = 0; i < uno.length; i++) {
		uno[i].style.zIndex = customZindex;
		customZindex--;

		uno[i].addEventListener('click', function(e){

			var tgt = e.target;
			var unoThis = this;
			var frontEl = tgt.closest && tgt.closest('.face-front');
			var backEl = tgt.closest && tgt.closest('.face-back');
			var portadaEl = tgt.closest && tgt.closest('#portada');
			var trsfEl = tgt.closest && tgt.closest('#trsf');
			var portadaBackEl = unoThis.querySelector('#portada-back'); // Check xem cÃ³ pháº£i tá» cuá»‘i khÃ´ng

			unoThis.style.zIndex = contZindex;
			contZindex++;

			if (frontEl && unoThis.contains(frontEl)) {
				unoThis.style.zIndex = contZindex;
				contZindex +=20;
				setTimeout(function(){
					unoThis.style.transform = 'rotateY(-180deg)';
					// Náº¿u lÃ  tá» cuá»‘i (cÃ³ portada-back), khÃ´ng tÄƒng sá»‘ láº§n láº­t (vÃ¬ Ä‘Ã³ lÃ  bÃ¬a sau, khÃ´ng cÃ³ ná»™i dung)
					if (portadaBackEl) {
						// KhÃ´ng cáº­p nháº­t sá»‘ láº§n láº­t, vÃ¬ Ä‘Ã¢y lÃ  bÃ¬a sau (khÃ´ng cÃ³ ná»™i dung)
						shiftBookFinal('right', 500);
						// Sau khi trang cuá»‘i hiá»‡n ra: áº©n sÃ¡ch -> doubleHeart rÆ¡i xuá»‘ng -> Ä‘á»•i thÃ nh gift-box
						showFinalCta(true, 1000);
					} else {
						// TÃ­nh toÃ¡n sá»‘ láº§n láº­t má»›i: láº­t tá»« front sang back = tÄƒng 1 láº§n láº­t
						var newFlip = currentFlip + 1;
						if (newFlip <= totalFlips) {
							updatePageIndicator(newFlip);
						}
					}
				}, 500);
			}
			if (backEl && unoThis.contains(backEl)) {
				unoThis.style.zIndex = contZindex;
				contZindex +=20;

				// Náº¿u Ä‘ang á»Ÿ bÃ¬a sau (portada-back) thÃ¬ cho CTA fade-out ngay khi click
				var isPortadaBack = tgt.closest && tgt.closest('#portada-back');
				if (isPortadaBack) {
					showFinalCta(false, 0);
				}

				setTimeout(function(){
					unoThis.style.transform = 'rotateY(0deg)';
					// Náº¿u lÃ  máº·t sau tá» cuá»‘i (portada-back), dá»‹ch láº¡i 128px vá» trÃ¡i vÃ  khÃ´ng giáº£m sá»‘ láº§n láº­t
					if (isPortadaBack) {
						shiftBookFinal('left', 500);
						// Giá»¯ nguyÃªn sá»‘ láº§n láº­t lÃ  totalFlips (vÃ¬ Ä‘ang quay láº¡i tá»« bÃ¬a sau)
						updatePageIndicator(totalFlips);
					} else {
						// TÃ­nh toÃ¡n sá»‘ láº§n láº­t má»›i: láº­t tá»« back sang front = giáº£m 1 láº§n láº­t
						var newFlip = currentFlip - 1;
						if (newFlip >= 0) {
							updatePageIndicator(newFlip);
						}
					}
				}, 500);
			}

			if (portadaEl) {
				flip.classList.remove("trnsf-reset");
				flip.classList.add("trnsf");
				// Äang á»Ÿ bÃ¬a (chÆ°a láº­t) = 0 láº§n láº­t
				updatePageIndicator(0);
			}
			if (trsfEl) {
				flip.classList.remove("trnsf");
				flip.classList.add("trnsf-reset");
				// ÄÃ£ láº­t láº§n 1 (máº·t sau bÃ¬a)
				updatePageIndicator(1);
			}

		});
	}
}

// HÃ m Ä‘á»ƒ re-initialize (gá»i láº¡i khi book Ä‘Æ°á»£c táº¡o Ä‘á»™ng)
function reinitializeBookFlip() {
	initializeBookFlip();
}

// Expose hÃ m Ä‘á»ƒ cÃ³ thá»ƒ gá»i tá»« bÃªn ngoÃ i
if (typeof window !== 'undefined') {
	window.reinitializeBookFlip = reinitializeBookFlip;
}

// Khá»Ÿi táº¡o láº§n Ä‘áº§u
initializeBookFlip();
