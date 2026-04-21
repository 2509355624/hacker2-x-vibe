let selectedScene = '';

document.querySelectorAll('.scene-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.scene-btn').forEach(b => {
            b.classList.remove('border-indigo-500', 'bg-indigo-50');
            b.classList.add('border-gray-200');
        });
        btn.classList.remove('border-gray-200');
        btn.classList.add('border-indigo-500', 'bg-indigo-50');
        selectedScene = btn.dataset.scene;
        document.getElementById('selected_scene').value = selectedScene;
    });
});

document.getElementById('generate_btn').addEventListener('click', async () => {
    const userInput = document.getElementById('user_input').value.trim();
    const btn = document.getElementById('generate_btn');
    const btnText = document.getElementById('btn_text');
    const loadingText = document.getElementById('loading_text');

    if (!selectedScene) {
        showToast('请先选择对应的场景');
        return;
    }
    if (!userInput) {
        showToast('请输入对方的刁难话术');
        return;
    }

    btn.disabled = true;
    btnText.classList.add('hidden');
    loadingText.classList.remove('hidden');
    hideToast();

    try {
        const response = await fetch('/api/generate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                scene: selectedScene,
                user_input: userInput
            })
        });

        const result = await response.json();

        if (result.code === 200) {
            const backtalk = result.data.backtalk;
            document.getElementById('low_eq').textContent = backtalk.低情商.join('\n');
            document.getElementById('mid_eq').textContent = backtalk.中情商.join('\n');
            document.getElementById('high_eq').textContent = backtalk.高情商.join('\n');
            document.getElementById('super_eq').textContent = backtalk.超高情商.join('\n');
            document.getElementById('mind_content').textContent = result.data.mind_help.join('\n');
            document.getElementById('refuse_content').textContent = result.data.refuse_words.join('\n');
            document.getElementById('result_card').classList.remove('hidden');
            document.getElementById('result_card').scrollIntoView({ behavior: 'smooth' });
        } else {
            showToast(result.msg);
        }
    } catch (e) {
        showToast('网络异常，请稍后重试');
        console.error(e);
    } finally {
        btn.disabled = false;
        btnText.classList.remove('hidden');
        loadingText.classList.add('hidden');
    }
});

document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const content = document.getElementById(targetId).textContent;
        navigator.clipboard.writeText(content).then(() => {
            const originalText = btn.textContent;
            btn.textContent = '复制成功！';
            setTimeout(() => {
                btn.textContent = originalText;
            }, 2000);
        }).catch(() => {
            showToast('复制失败，请手动复制');
        });
    });
});

function showToast(msg) {
    const toast = document.getElementById('error_toast');
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => {
        hideToast();
    }, 3000);
}

function hideToast() {
    const toast = document.getElementById('error_toast');
    toast.classList.add('hidden');
}
