    // =================infinite scroll===========

    let currentPage=1
    let lastPage=1

    window.addEventListener("scroll", function(){
        
        const endOfPage = window.innerHeight + window.pageYOffset >= document.body.scrollHeight;
        console.log(endOfPage)
        console.log(currentPage,lastPage)
        if (endOfPage && currentPage < lastPage) {
            currentPage=currentPage+1
            getPosts(false,currentPage)
        }

    
    });
    
    
    SetUpUI()
    // حطيت ال baseUrl بره الداله عشان كل الدوال تقدر توصلو يبقي Global

    getPosts()
    function getPosts(reload=true,page=1) {
        toggleLoader(true)
        axios.get(`${baseUrl}/posts?limit=4&page=${page}`)
            .then(function (response) {
                // هنا ال response هيكون جيه فهخفي ال loader
                toggleLoader(false)
                const posts = response.data.data

                lastPage=response.data.meta.last_page
                if(reload){
                    document.getElementById("posts").innerHTML = ""
                }

                for (post of posts) {
                    const author = post.author
                    let postTitle = ""

                    let user =getCurrentUser()
                    let isMypost= user != null && post.author.id ==user.id
                    let editBtnContent=``
                    if(isMypost){
                        editBtnContent=`
                        <button class="btn btn-danger" style=" margin-left:5px; float:right;" onclick="deletePostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
                        <button class="btn btn-secondary"style="float:right" onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
                        `
                    }
                    if (post.title != null) {
                        postTitle = post.title
                    }
                    let content = `
                                        <div class="card shadow my-3">
                                            <div class="card-header" >
                                            <span onclick="userClicked(${author.id})" style="cursor:pointer;">
                                                <img style="width: 40px;height: 40px; border-radius: 50%;" class="border border-2"src="${author.profile_image}">
                                                <b>${author.username}</b>
                                            </span>
                                                ${editBtnContent}
                                            </div>
                                            <div class="card-body" onclick="postClicked(${post.id})" style="cursor:pointer;">
                                                <img style="width: 100%; height: 200px;" src="${post.image}">
                                                <h6 style="color: rgba(25, 23, 23, 0.603); margin-top: 3px;">
                                                    ${post.created_at}
                                                    </h6>
                                                <h5>
                                                    ${postTitle}
                                                </h5>
                                                <p>
                                                    ${post.body}
                                                </p>
                                                <hr>
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                                            class="bi bi-pencil" viewBox="0 0 16 16">
                                                            <path
                                                            d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                                    </svg>
                                                    <span>
                                                        (${post.comments_count})comment
                                                    </span>
                                                    <span id="post-tags">

                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                
                `
                    document.getElementById("posts").innerHTML += content

                    // todo tags
                    //     const currentPostTagsId=`post-tags-${post.id}`
                    //     document.getElementById(currentPostTagsId).innerHTML= ""
                    //     for(tag of post.tags){
                    //         console.log(tag.name)

                    //         let tagsContent =`
                    //         <button class="btn btn-sm rounded-5 " style="background-color: gray; color:white;">
                    //             ${tag.name}
                    //         </button>
                    //         `
                    //         document.getElementById(currentPostTagsId).innerHTML+=tagsContent
                    //     }
                }
            })
    }

    // وظيفه الداله  انها هتحولني علي البوسط الي انا ظغط عليه بببيناته عند الضغط علي الزر
    function postClicked(postId){
    window.location =`postDetails.html?postId=${postId}`
    }


    function addBtnClicked(){
                document.getElementById("post-modal-submit-btn").innerHTML="create"
                document.getElementById("post-id-input").value=""
                document.getElementById("post-modal-title").innerHTML="Create A New Post"
                document.getElementById("post-title-input").value=""
                document.getElementById("post-body-input").value=""
                document.getElementById("post-image-input").value=""
                let postModal = new bootstrap.Modal(document.getElementById("create-post-modal"), {})
                // toggle=> بتفتح البوسط اذا كان مقفول وبتقفله اذا كان مفتوح
                postModal.toggle()
                
    }

    function userClicked(userId){
        window.location=`profile.html?userid=${userId}`
    }


/*
يتم حفظ العنصر في ال localSorage بصيغه ال string
==================================================
الكلام ده كان  مشكله لما جيت اعمل داله لزرار الاديت بتاع البوست الداله اسمها editPostBtnClicked
مينفعش تبعت object ك parameter ل function داخل كود ال html لان ال html مبتفهمش غير الارقام والstring متعرفش حاجه اسمها object 
كنت هبعت ال post كبراميتر للداله علي الزرار بتاع الاديت بس مينفعش عشان html مبتفهمش يعني اي object 
الحل من خلال السطرين الي تحت دول
let post =JSON.parse(decodeURIComponent(postObject))
onclick="editPostBtnClicked(${encodeURIComponent(JSON.stringify(post))})"
*/