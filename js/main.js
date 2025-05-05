// 评论功能
document.addEventListener('DOMContentLoaded', function() {
    const commentForm = document.querySelector('.comment-form');
    const commentsList = document.querySelector('.comments-container');
    const prevPageBtn = document.querySelector('.prev-page');
    const nextPageBtn = document.querySelector('.next-page');
    const pageInfo = document.querySelector('.page-info');
    
    let currentPage = 1;
    const commentsPerPage = 2;

    // 从localStorage加载评论
    function loadComments() {
        // 获取评论数据
        let comments = JSON.parse(localStorage.getItem('comments') || '[]');
        
        // 清空评论列表
        commentsList.innerHTML = '';

        // 按时间戳降序排序（最新的在前）
        comments.sort((a, b) => b.timestamp - a.timestamp);

        // 计算总页数
        const totalPages = Math.ceil(comments.length / commentsPerPage);

        // 更新页码信息
        pageInfo.textContent = `第 ${currentPage} 页 / 共 ${totalPages} 页`;

        // 计算当前页的评论范围
        const startIndex = (currentPage - 1) * commentsPerPage;
        const endIndex = startIndex + commentsPerPage;

        // 添加当前页的评论
        comments.slice(startIndex, endIndex).forEach((comment, index) => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <div class="comment-header">
                    <span class="comment-author">${comment.name}</span>
                    <span class="comment-date">${comment.date}</span>
                </div>
                <div class="comment-content">
                    <p>${comment.content}</p>
                </div>
                <div class="comment-actions">
                    <button class="like-btn" onclick="toggleLike(this)">
                        <span class="like-count">${comment.likes || 0}</span> 点赞
                    </button>
                </div>
            `;
            commentsList.appendChild(commentElement);
        });

        // 更新翻页按钮状态
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }

    // 上一页按钮点击事件
    prevPageBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            loadComments();
        }
    });

    // 下一页按钮点击事件
    nextPageBtn.addEventListener('click', function() {
        const totalPages = Math.ceil(JSON.parse(localStorage.getItem('comments') || '[]').length / commentsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            loadComments();
        }
    });

    // 保存评论
    function saveComment(name, content, date) {
        let comments = JSON.parse(localStorage.getItem('comments') || '[]');
        
        // 创建新评论对象
        const newComment = {
            name: name,
            content: content,
            date: date,
            likes: 0,
            timestamp: Date.now()
        };

        // 将新评论添加到数组开头
        comments.unshift(newComment);
        
        // 保存到localStorage
        localStorage.setItem('comments', JSON.stringify(comments));
        
        // 重置到第一页
        currentPage = 1;
    }

    // 提交评论
    commentForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const content = document.getElementById('comment').value;

        if (!name || !content) {
            alert('请填写姓名和评论内容');
            return;
        }

        const today = new Date();
        const date = today.getFullYear() + '-' + 
                    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(today.getDate()).padStart(2, '0');

        saveComment(name, content, date);
        loadComments();
        commentForm.reset();
    });

    // 点赞功能
    window.toggleLike = function(button) {
        const likeCount = button.querySelector('.like-count');
        let comments = JSON.parse(localStorage.getItem('comments') || '[]');
        const commentIndex = Array.from(button.closest('.comment').parentNode.children)
            .indexOf(button.closest('.comment'));

        if (commentIndex >= 0 && commentIndex < comments.length) {
            comments[commentIndex].likes = (comments[commentIndex].likes || 0) + 1;
            localStorage.setItem('comments', JSON.stringify(comments));
            likeCount.textContent = comments[commentIndex].likes;
            button.classList.add('active');
        }
    };

    // 初始加载评论
    loadComments();
});

// 图片滚动功能
document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.querySelector('.gallery');
    const prevBtn = document.querySelector('.gallery-btn.prev');
    const nextBtn = document.querySelector('.gallery-btn.next');
    const images = document.querySelectorAll('.gallery img');
    let currentIndex = 0;

    function updateGallery() {
        gallery.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateGallery();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        updateGallery();
    });
}); 