import { fetchCategories, fetchProducts } from "./api.js";

function $(selector){
    return document.querySelector(selector);
}

function newProduct({image, price, title, rating}) {
    return `<div class="col-4 col-tl-6 col-p-12">
        <div class="box center-center gap-1">
            <img class="img-resp product" src=${image} alt=${title} width="300" height="100">
            <div class="caption">
                <h3>${title}</h3>
                <span>$${price}</span>
                <p>Rating: ${rating.rate} (${rating.count} ratings)</p>
            </div>
        </div>
    </div>`
}

let mssgId;

function showError(mssg) {
    if(!mssgId) {
        $('.mssg').textContent = mssg;
        mssgId = setTimeout(() => {
            $('.mssg').textContent = "";
            mssgId = null;
        }, 2000);
    }
    else {
        mssgId = setTimeout(() => {
            showError(mssg);
        }, 4000);
    }
}


function listProducts(category = "all", sort = "asc") {
    $('.overlay').classList.add('active');
    fetchProducts(category, sort).then(data => {
        const productList = $('.products-list .row.gap');
        let content = ""
        data.map(product => {
            content += newProduct(product);
        });
        productList.innerHTML = content;
        $(".breadcrumb li span").textContent = category[0].toUpperCase() + category.slice(1);
        $('.overlay').classList.remove('active');
    }).catch(err => {
        console.error(err);
        showError("Unable to fetch products");
        $('.overlay').classList.remove('active');
    });
}

function listCategories() {
    fetchCategories().then(data => {
        const categoryList = $('.product-category');
        ["all", ...data].map(category => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.textContent = category[0].toUpperCase() + category.slice(1);
            a.classList.add("category");
            if(category === "all") {
                a.classList.add("active");
            }
            a.href = "";
            li.appendChild(a);
            categoryList.appendChild(li);
            a.addEventListener("click", (e) => {
                e.preventDefault();
                listProducts(category);
                if(!a.classList.contains("active")) {
                    document.querySelectorAll(".category").forEach(link => {
                        if(link.classList.contains("active")) {
                            link.classList.remove("active");
                        }
                    });
                    a.classList.add("active");
                }
            });
        })
    }).catch(err => {
        console.log(err);
        showError("Unable to fetch categories");
    });
}

listProducts();
listCategories();

$(".dropdown").addEventListener("click", function(event) {
    event.stopImmediatePropagation();
    this.classList.toggle("open");
});

function sortProducts() {
    if(!this.classList.contains("selected")) {
        this.classList.add("selected");
        const sibling = $(`#${this.id == "asc" ? "desc" : "asc"}`);
        sibling.classList.remove("selected");
        const categorySelected = $('.category.active');
        let categoryText = "all";
        if(categorySelected) {
            categoryText = categorySelected.textContent.toLowerCase();
        }
        listProducts(categoryText, this.getAttribute('data-sort'));
        $('.sort-btn').textContent = this.textContent;
    }
}

$(".sort-list #asc").addEventListener("click", sortProducts);
$(".sort-list #desc").addEventListener("click", sortProducts);