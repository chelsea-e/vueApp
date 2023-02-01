const app = new Vue({
  el: "#app",
  data: {
    page: "content",
    lessons: lessons,
    sorting: "price",
    cart: [],
    search: "",
    name: "",
    phone: "",
    error: {
      name: "",
      phone: "",
    },
    disabled: [true, true],
    sortOption: "",
    orderOption: "",
  },
  methods: {
    // Add lesson to cart
    addtocart(lesson) {
      this.cart.push(lesson);
    },
    // Remove lesson from cart
    removefromcart(id) {
      const index = this.cart.findIndex((item) => item.id === id);
      this.cart.splice(index, 1)
      if (this.cart.length == 0) {
        this.page = 'content'
      }
    },
    // Checking to see if the user can add a lesson to cart
    canaddtocart(lesson) {
      return lesson.spaces > this.cartSpace(lesson);
    },
    // Lesson Cart Count 
    cartSpace(lesson) {
      let x = 0;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i] == lesson) {
          x++;
        }
      }
      return x;
    },
    // Switching Pages
    navigateTo(page) {
      this.page = page;
    },

    // Validation of name inputted the user
    validateName(value) {
      if (!value) {
        this.error["name"] = "Your name cannot be left empty";
        this.disabled = [true, this.disabled[1]];
      } else if (!/^[A-Za-z\s]*$/.test(value)) {
        this.error["name"] = "Your name must contain only letters";
        this.disabled = [true, this.disabled[1]];
      } else {
        this.error["name"] = "";
        this.disabled = [false, this.disabled[1]];
      }
    },

    // Validation of phone number inputed the user
    validatePhone(value) {
      if (!value) {
        this.error["phone"] = "Your phone number cannot be left empty";
        this.disabled = [this.disabled[1], true];
      } else if (!/^[0-9]*$/ || !/^[0-9]{11}$/.test(value)) {
        this.error["phone"] = "Only 11 digits are valid";
        this.disabled = [this.disabled[1], true];
      } else {
        this.error["phone"] = "";
        this.disabled = [this.disabled[1], false];
      }
    },

    // Confirmation of order submission 
    checkout() {
      alert("Your order has been successfully submitted");

      this.cart = [];

      this.navigateTo("content");
    },
  },
  // Number of lessons in the Cart
  computed: {
    cartItems: function () {
      return this.cart.length || "";
    },
    // Search and Sort
    filteredLessons() {
      let tempLessons = this.lessons;

      // Search Function
      if (this.search != "" && this.search) {
        tempLessons = tempLessons.filter((item) => {
          return (
            item.subject.toLowerCase().includes(this.search.toLowerCase()) ||
            item.location.toLowerCase().includes(this.search.toLowerCase())
          );
        });
      }
      // Sort Function
      tempLessons = tempLessons.sort((a, b) => {
        // Sorting according to subject
        if (this.sortOption == "subject") {
          let fa = a.subject.toLowerCase(),
            fb = b.subject.toLowerCase();

          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        } 
          // Sorting according to location
        else if (this.sortOption == "location") {
          let fa = a.location.toLowerCase(),
            fb = b.location.toLowerCase();

          if (fa < fb) {
            return -1;
          }
          if (fa > fb) {
            return 1;
          }
          return 0;
        } 
          // Sorting according to price
        else if (this.sortOption == "price") {
          return a.price - b.price;
        } 
          // Sorting according to spaces
        else if (this.sortOption == "stock") {
          return a.spaces - b.spaces;
        }
      });

      // Sorting according to ascending/descending order
      if (this.orderOption === "desc") {
        tempLessons.reverse();
      }

      return tempLessons;
    },
  },
  // User Details
  watch: {
    name(value) {
      this.validateName(value);
    },
    phone(value) {
      this.validatePhone(value);
    },
  },
});
