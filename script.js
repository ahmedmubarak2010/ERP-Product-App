let title=document.getElementById("title");
let price=document.getElementById("price");
let quantity=document.getElementById("quantity");
let category=document.getElementById("category");
let categoryColor=document.getElementById("categoryColor");
let description=document.getElementById("description");
let mainBtn=document.getElementById("mainBtn");
let products=document.getElementById("products");
let message=document.getElementById("message");
let search=document.getElementById("search");
let categoryFilter=document.getElementById("categoryFilter");
let sort=document.getElementById("sort");
let emptyState=document.getElementById("emptyState");

let productsList=[];
let editIndex=null;

if(localStorage.getItem("products")){
    productsList=JSON.parse(localStorage.getItem("products"));
    displayProducts();
    updateStatistics();
    updateCategories();
}

function saveData(){
    localStorage.setItem("products",JSON.stringify(productsList));
}

function clearForm(){
    title.value="";
    price.value="";
    quantity.value="";
    category.value="";
    categoryColor.selectedIndex=0;
    description.value="";
    title.focus();
}

function showMessage(text,type){

    message.innerHTML=text;

    message.classList.remove("success");
    message.classList.remove("error");
    message.classList.remove("warning");

    message.classList.add(type);

    setTimeout(function(){

        message.classList.remove(type);

    },3000);

}
mainBtn.onclick=function(){

    if(title.value==""||price.value==""||quantity.value==""||category.value==""||description.value==""){
        showMessage("Please fill all fields","warning");
        return;
    }

    let product={
    id:Date.now(),
    title:title.value,
    price:+price.value,
    quantity:+quantity.value,
    category:category.value,
    color:categoryColor.value,
    description:description.value,
    createdAt:new Date().toLocaleString(),
    updatedAt:"None"
};
    if(editIndex===null){

        productsList.push(product);

        showMessage("Product added successfully","success");

    }else{

        product.id=productsList[editIndex].id;
        product.createdAt=productsList[editIndex].createdAt;
        product.updatedAt=new Date().toLocaleString();

        productsList[editIndex]=product;

        editIndex=null;

        mainBtn.innerHTML="Add Product";

        showMessage("Product updated successfully","success");

    }

    saveData();
    displayProducts();
    updateStatistics();
    updateCategories();
    clearForm();

}
function getCategoryColor(category){

    switch(category){

        case "Electronics":
            return "#3b82f6";

        case "Clothes":
            return "#a855f7";

        case "Books":
            return "#f59e0b";

        case "Food":
            return "#22c55e";

        case "Sports":
            return "#ef4444";

        default:
            return "#64748b";

    }

}
function displayProducts(){

    let cartona="";

    for(let i=0;i<productsList.length;i++){

        let stock="In Stock";
        let stockClass="in-stock";

        if(productsList[i].quantity<=5){
            stock="Low Stock";
            stockClass="low-stock";
        }

        if(productsList[i].quantity==0){
            stock="Out Of Stock";
            stockClass="out-stock";
        }

        let categoryColor=productsList[i].color||"#64748b";

        cartona+=`
        <div class="product-card slide-up">

            <div class="product-top" style="background:${categoryColor}"></div>

            <div class="product-body">

                <h2 class="product-title">${productsList[i].title}</h2>

                <div class="product-info">
                    <span>${productsList[i].price} EGP</span>
                    <span>Qty : ${productsList[i].quantity}</span>
                </div>

                <div class="category" style="background:${categoryColor};color:#fff;">
                    ${productsList[i].category}
                </div>

                <p class="description">
                    ${productsList[i].description}
                </p>

                <div class="date">
                    <p>Added : ${productsList[i].createdAt}</p>
                    <p>Updated : ${productsList[i].updatedAt}</p>
                </div>

                <div class="stock ${stockClass}">
                    ${stock}
                </div>

                <div class="actions">
                    <button class="edit-btn" onclick="editProduct(${i})">Edit</button>
                    <button class="delete-btn" onclick="deleteProduct(${i})">Delete</button>
                </div>

            </div>

        </div>
        `;

    }

    products.innerHTML=cartona;

    if(productsList.length==0){
        emptyState.style.display="block";
        products.style.display="none";
    }else{
        emptyState.style.display="none";
        products.style.display="grid";
    }

}
function deleteProduct(index){

    productsList.splice(index,1);

    saveData();

    displayProducts();

    updateStatistics();

    updateCategories();

    showMessage("Product deleted successfully","success");

}
function editProduct(index){

    title.value=productsList[index].title;
    price.value=productsList[index].price;
    quantity.value=productsList[index].quantity;
    category.value=productsList[index].category;
    categoryColor.value=productsList[index].color;
    description.value=productsList[index].description;

    editIndex=index;

    mainBtn.innerHTML="Save Changes";

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}
function updateStatistics(){

    document.getElementById("productsCount").innerHTML=productsList.length;

    let totalQuantity=0;
    let inventoryValue=0;
    let totalPrice=0;
    let highestPrice=0;
    let highestProduct="-";
    let categories={};

    for(let i=0;i<productsList.length;i++){

        totalQuantity+=productsList[i].quantity;

        inventoryValue+=productsList[i].price*productsList[i].quantity;

        totalPrice+=productsList[i].price;

        if(productsList[i].price>highestPrice){

            highestPrice=productsList[i].price;

            highestProduct=productsList[i].title;

        }

        if(categories[productsList[i].category]){

            categories[productsList[i].category]++;

        }else{

            categories[productsList[i].category]=1;

        }

    }

    document.getElementById("totalQuantity").innerHTML=totalQuantity;

    document.getElementById("inventoryValue").innerHTML=inventoryValue+" EGP";

    if(productsList.length>0){

        document.getElementById("averagePrice").innerHTML=Math.round(totalPrice/productsList.length)+" EGP";

    }else{

        document.getElementById("averagePrice").innerHTML="0 EGP";

    }

    document.getElementById("highestPrice").innerHTML=highestProduct;

    let topCategory="-";
    let max=0;

    for(let key in categories){

        if(categories[key]>max){

            max=categories[key];

            topCategory=key;

        }

    }

    document.getElementById("topCategory").innerHTML=topCategory;

}
search.onkeyup=function(){

    let cartona="";

    let value=search.value.toLowerCase();

    for(let i=0;i<productsList.length;i++){

        if(productsList[i].title.toLowerCase().includes(value)
        ||productsList[i].category.toLowerCase().includes(value)
        ||productsList[i].description.toLowerCase().includes(value)){

            let stock="In Stock";
            let stockClass="in-stock";

            if(productsList[i].quantity<=5){
                stock="Low Stock";
                stockClass="low-stock";
            }

            if(productsList[i].quantity==0){
                stock="Out Of Stock";
                stockClass="out-stock";
            }

            cartona+=`
            <div class="product-card">

                <div class="product-top"></div>

                <div class="product-body">

                    <h2 class="product-title">${productsList[i].title}</h2>

                    <div class="product-info">
                        <span>${productsList[i].price} EGP</span>
                        <span>Qty : ${productsList[i].quantity}</span>
                    </div>

                    <div class="category">${productsList[i].category}</div>

                    <p class="description">${productsList[i].description}</p>

                    <div class="date">
                        <p>Added : ${productsList[i].createdAt}</p>
                        <p>Updated : ${productsList[i].updatedAt}</p>
                    </div>

                    <div class="stock ${stockClass}">
                        ${stock}
                    </div>

                    <div class="actions">
                        <button class="edit-btn" onclick="editProduct(${i})">Edit</button>
                        <button class="delete-btn" onclick="deleteProduct(${i})">Delete</button>
                    </div>

                </div>

            </div>
            `;

        }

    }

    products.innerHTML=cartona;

}
function updateCategories(){

    let categories=[];

    categoryFilter.innerHTML='<option value="all">All Categories</option>';

    for(let i=0;i<productsList.length;i++){

        if(!categories.includes(productsList[i].category)){

            categories.push(productsList[i].category);

            categoryFilter.innerHTML+=`
            <option value="${productsList[i].category}">
                ${productsList[i].category}
            </option>
            `;

        }

    }

}
categoryFilter.onchange=function(){

    if(categoryFilter.value=="all"){
        displayProducts();
        return;
    }

    let cartona="";

    for(let i=0;i<productsList.length;i++){

        if(productsList[i].category==categoryFilter.value){

            let stock="In Stock";
            let stockClass="in-stock";

            if(productsList[i].quantity<=5){
                stock="Low Stock";
                stockClass="low-stock";
            }

            if(productsList[i].quantity==0){
                stock="Out Of Stock";
                stockClass="out-stock";
            }

            let categoryColor=productsList[i].color||"#64748b";

            cartona+=`
            <div class="product-card slide-up">

                <div class="product-top" style="background:${categoryColor}"></div>

                <div class="product-body">

                    <h2 class="product-title">${productsList[i].title}</h2>

                    <div class="product-info">
                        <span>${productsList[i].price} EGP</span>
                        <span>Qty : ${productsList[i].quantity}</span>
                    </div>

                    <div class="category" style="background:${categoryColor};color:#fff;">
                        ${productsList[i].category}
                    </div>

                    <p class="description">
                        ${productsList[i].description}
                    </p>

                    <div class="date">
                        <p>Added : ${productsList[i].createdAt}</p>
                        <p>Updated : ${productsList[i].updatedAt}</p>
                    </div>

                    <div class="stock ${stockClass}">
                        ${stock}
                    </div>

                    <div class="actions">
                        <button class="edit-btn" onclick="editProduct(${i})">Edit</button>
                        <button class="delete-btn" onclick="deleteProduct(${i})">Delete</button>
                    </div>

                </div>

            </div>
            `;

        }

    }

    products.innerHTML=cartona;

}
sort.onchange=function(){

    if(sort.value=="priceAsc"){
        productsList.sort((a,b)=>a.price-b.price);
    }

    if(sort.value=="priceDesc"){
        productsList.sort((a,b)=>b.price-a.price);
    }

    if(sort.value=="quantityAsc"){
        productsList.sort((a,b)=>a.quantity-b.quantity);
    }

    if(sort.value=="quantityDesc"){
        productsList.sort((a,b)=>b.quantity-a.quantity);
    }

    if(sort.value=="az"){
        productsList.sort((a,b)=>a.title.localeCompare(b.title));
    }

    if(sort.value=="za"){
        productsList.sort((a,b)=>b.title.localeCompare(a.title));
    }

    if(sort.value=="newest"){
        productsList.sort((a,b)=>b.id-a.id);
    }

    if(sort.value=="oldest"){
        productsList.sort((a,b)=>a.id-b.id);
    }

    displayProducts();

}