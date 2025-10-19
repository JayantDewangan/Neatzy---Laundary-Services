// ============== Clicking "Book a service today"=======
const bookServiceBtnClick = ()=>{
    const bookServiceBtn = document.querySelector(".our__services");
    bookServiceBtn.scrollIntoView({behavior: 'smooth'});
}


// ======== for Book now button =============
const bookNowBtn = document.querySelector(".book");
const bookingErrorMsg = document.querySelector(".booking-error");
const nullError = document.querySelector(".null-value-error");

bookNowBtn.addEventListener('click',(event)=>{
    event.preventDefault();
    if(cartItems.length===0){
        if (bookingErrorMsg) {
            bookingErrorMsg.style.display = 'block'; // Or 'flex'
        }
    }
    else {
        // Cart has items: HIDE the error (if it's showing)
        if (bookingErrorMsg) {
            bookingErrorMsg.style.display = 'none';
        }
    }


    const formName = document.querySelector(".name");
    const formMail = document.querySelector(".mailid");
    const formPhone = document.querySelector(".ph");
    const nullError = document.querySelector(".null-value-error")
    const successMsg = document.querySelector(".success");
    if(cartItems.length !== 0){
        if(formName.value.trim() === "" || formMail.value.trim() === "" || formPhone.value.trim() ===""){
            nullError.style.display = 'block';
        }
        else{
            nullError.style.display = 'none';

            const totalAmount = document.querySelector(".total p:nth-child(2) span").innerHTML;
            emailjs.send("service_wvkazme", "template_qaalfpd", {
                name: formName.value,
                email: formMail.value,
                phone: formPhone.value,
                // This formats the services list nicely for the email
                services: cartItems.map(item => `${item.name} (${item.price})`).join("\n"),
                total: `${totalAmount}`, // Send the total
                text: "Booking request submitted via laundry form",
                title: "Laundry Booking Confirmation"
            })
            .then(() => {
                successMsg.style.display = 'block';
                // Optional: clear the form after success
                formName.value = '';
                formMail.value = '';
                formPhone.value = '';
                
                const allRemoveButtons = document.querySelectorAll(".remove"); // Find all buttons in the "remove" state
                allRemoveButtons.forEach(button => {
                    button.classList.remove('remove');
                    button.classList.add("add__remove");
                    button.innerHTML = 'Add Item<i class="uil uil-plus-circle"></i>';
                });

                cartItems.length = 0; 

                document.querySelectorAll(".row__1").forEach(row => row.remove());

                temp.style.display = 'flex';

                totalPrice = 0;
                const totalAmount = document.querySelector(".total p:nth-child(2) span");
                totalAmount.innerHTML = '0.00'; 

                bookNowBtn.style.opacity = '0.4';

                setTimeout(() => {
                    successMsg.style.display = 'none';
                }, 3000);
                
            })
            .catch((error) => {
                console.error("EmailJS error:", error);
                alert("An email error occurred. Please try again.");
            });
                }
            }
    else{
        nullError.style.display = 'none';
    }
})


// =========== Our Services functionality ========== 
// cart array to track added items : 
const cartItems = [];
let sNo = 1;
let totalPrice = 0;
const serviceAdd = document.querySelector(".services_right__one__middle");
const temp = document.querySelector(".temp");
const book = document.querySelector(".book");

const btn = document.querySelectorAll(".add__remove");
btn.forEach((btn) => {
  btn.addEventListener('click', () => {
    // ================ extracting info =========== 
    const service = btn.closest(".services");
    const name = service.querySelector(".service__name-price p:nth-child(2)").textContent.trim();
    const price = service.querySelector(".service__name-price span").textContent.trim();
    const numericPrice = parseFloat(price.replace(/[^\d.]/g, ""));

    // =========== pressing remove item button ============
    if (btn.classList.contains('remove')) {
      btn.classList.remove('remove');
      btn.classList.add("add__remove");
      btn.innerHTML = 'Add Item<i class="uil uil-plus-circle"></i>';

      // ============ removing item from the array ============
      const index = cartItems.findIndex(item => item.name === name);
      if (index !== -1) {
        cartItems.splice(index, 1);
      }

      // ============= removing item from the DOM =============
      const rows = document.querySelectorAll(".row__1");
      rows.forEach(row => {
        const rowName = row.querySelector(".service__name p").textContent.trim();
        if (rowName === name) {
          row.remove();
        }
      });

      // ============ updating total price =============== 
      totalPrice -= numericPrice;
      const totalAmount = document.querySelector(".total p:nth-child(2) span");
      totalAmount.innerHTML = totalPrice.toFixed(2);

      // ============= updating serial Number again ==============
      sNo = 1;
      document.querySelectorAll(".row__1").forEach(row => {
        row.querySelector(".s__no p").innerHTML = sNo++;
      });

      // ============ bringing temp text and book btn opacity back ===============
      if(cartItems.length === 0){
        temp.style.display = "flex";
        book.style.opacity = "0.4";
        if (nullError) {
            nullError.style.display = 'none';
        }
      }

    } else {
      // ======= ADD ITEM =======
      btn.classList.remove('add__remove');
      btn.classList.add("remove");
      btn.innerHTML = 'Remove Item<i class="uil uil-minus-circle"></i>';

      temp.style.display = "none";

      let newEle = document.createElement("div");
      newEle.classList.add('row__1');

      let s_no = document.createElement("div");
      s_no.classList.add("s__no");
      let p1 = document.createElement("p");
      p1.innerHTML = sNo++;
      s_no.appendChild(p1);
      newEle.appendChild(s_no);

      let service_name = document.createElement("div");
      service_name.classList.add("service__name");
      let p2 = document.createElement("p");
      p2.innerHTML = name;
      service_name.appendChild(p2);
      newEle.appendChild(service_name);

      let price1 = document.createElement("div");
      price1.classList.add("price__s");
      let p3 = document.createElement("p");
      p3.innerHTML = price;
      price1.appendChild(p3);
      newEle.appendChild(price1);

      serviceAdd.appendChild(newEle);

      totalPrice += numericPrice;
      const totalAmount = document.querySelector(".total p:nth-child(2) span");
      totalAmount.innerHTML = totalPrice.toFixed(2);

      // updating cartItems array :
      cartItems.push({ name, price: price });

      if (cartItems.length !== 0) {
        book.style.opacity = "1";
      }

      if (bookingErrorMsg) {
        bookingErrorMsg.style.display = 'none';
      }

    }
  });
});


// Select all the input fields in your form
const formInputs = document.querySelectorAll(".services__right__two input");

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        if (cartItems.length === 0) {
            if (bookingErrorMsg) {
                bookingErrorMsg.style.display = 'block';
            }
        }
    });
});


// =========== Newsletter functionality ========== 

// 1. Select the elements from your newsletter section
const nlSection = document.querySelector(".newsteller__section");
const nlName = nlSection.querySelector('input[type="text"]');
const nlEmail = nlSection.querySelector('input[type="email"]');
const nlButton = nlSection.querySelector('button');

nlButton.addEventListener('click', () => {

    if (nlName.value.trim() === "" || nlEmail.value.trim() === "") {
        alert("Please enter both your name and email.");
        return;
    }
    const templateParams = {
        name: nlName.value,
        email: nlEmail.value
    };

    // 5. Send the email
    emailjs.send(
        'service_wvkazme',  
        'template_xtaheen',   
        templateParams
    )
    .then(() => {
        alert("Thank you for subscribing!");
        nlName.value = '';
        nlEmail.value = '';
    })
    .catch((error) => {
        alert("An error occurred. Please try again.");
        console.error("EmailJS error:", error);
    });
});