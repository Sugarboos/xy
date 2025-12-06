// Custom Button Animation Logic
// Adapted from CodePen for Synoriya Pricing Page

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP Plugin
    // Note: We need to ensure GSAP and Draggable are loaded globally or imported.
    // Since we are using CDN links in script tags for simplicity in standard web pages, 
    // we assume 'gsap' is available on window.

    const config = {
        scale: 1.0, // Reduced scale for website integration
    }

    const atc = document.querySelector('.atc')

    // Safety check if button exists
    if (!atc) return;

    // Set theme variables on main/root if needed, but we handle via CSS variables

    const main = atc; // Scope custom property to button itself usually, or document
    const text = atc.querySelector('.atc__text')
    const cart = atc.querySelector('.atc__cart')
    const item = atc.querySelector('.atc__cart-content')
    const animatedBorder = atc.querySelector('.atc__border--animated:not(.atc__border--demo)')
    const staticBorder = atc.querySelector('.atc__border--static')
    const completeBorder = atc.querySelector('.atc__border--complete')
    const dummy = atc.querySelector('.atc__cart--dummy')
    const check = atc.querySelector('.atc__check')
    let running = false

    // Initialize position
    gsap.set('.atc__cart-content', {
        y: -24
    })

    const addToCart = () => {
        if (running) return
        running = true
        atc.dataset.adding = 'true'

        const dummyRect = dummy.getBoundingClientRect()
        const cartRect = cart.getBoundingClientRect()
        const distance = {
            x: dummyRect.left - cartRect.left,
        }

        gsap.timeline({
            onComplete: () => {
                running = false
                atc.dataset.adding = 'false'
                // Redirect after animation completes (Optional - since it's a link usually)
                // window.location.href = '/#booking-screen';

                // Reset for demo purposes after a while? 
                // For a contact button, we might want it to just stay "Sent" or reset.
                // Resetting after 2s for re-use
                setTimeout(() => {
                    gsap.set([text, cart, item, staticBorder, completeBorder, animatedBorder, check], { clearProps: 'all' });
                    gsap.set('.atc__cart-content', { y: -24 });
                    atc.dataset.adding = 'false';
                    text.style.opacity = 1;
                    text.style.filter = 'blur(0px)';
                    cart.style.transform = 'translate(0,0)';
                }, 3000);
            }
        })
            .set(atc, {
                '--complete': 1,
            })
            .to(cart, {
                x: distance.x / config.scale,
                duration: 0.22,
            })
            .to(cart, {
                rotate: -20,
                yoyo: true,
                repeat: 1,
                duration: 0.11,
            }, 0)
            .to(text, {
                opacity: 0,
                x: distance.x / config.scale,
                duration: 0.22,
                filter: 'blur(6px)',
            }, 0)
            .to(item, {
                y: 0,
                duration: 0.1,
                delay: 0.1,
            })
            .to(staticBorder, {
                opacity: 1,
                duration: 0.1,
            }, '<')
            .set(atc, {
                '--complete': 0,
            })
            .set(animatedBorder, {
                opacity: 0,
            })
            .to(cart, {
                x: (distance.x / config.scale) * 4,
                duration: 0.6,
                delay: 0.1,
            })
            .to(cart, {
                rotate: -30,
                duration: 0.1,
            }, '<')
            .to(completeBorder, {
                opacity: 1,
                duration: 0.22,
            }, '<')
            .to(check, {
                opacity: 1,
                yoyo: true,
                scale: 1.5,
                duration: 0.25,
                repeatDelay: 0.125,
                repeat: 1,
            }, '<')
            .set(text, {
                x: 0,
                xPercent: 0,
                innerText: 'Sent!' // Change text to Sent! or Contacted!
            })
            .set(cart, {
                x: -100,
                rotate: 0,
            })
            .set(item, {
                y: -24,
            })
            .to([staticBorder, completeBorder], {
                opacity: 0,
                duration: 0.5,
                delay: 0.125,
            })
            .to(text, {
                xPercent: 0,
                opacity: 1,
                duration: 0.22,
                filter: 'blur(0px)',
            })
            .to(cart, {
                x: 0
            })
            .to(animatedBorder, {
                opacity: 1,
                duration: 1,
                ease: 'power2.in',
            })
    }

    atc.addEventListener('click', (e) => {
        // e.preventDefault(); // Uncomment if we want to prevent navigation to run animation first
        addToCart();
    });

    // GSAP Defaults
    gsap.defaults({
        duration: 0.5,
        ease: 'power2.out',
    })
});
