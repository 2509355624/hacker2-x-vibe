def check_user_input(content: str) -> tuple[bool, str]:
    if not content or len(content.strip()) == 0:
        return False, "请输入对方的刁难话术，不能为空哦"
    if len(content) > 500:
        return False, "输入内容不能超过500字，请精简后重试"
    sensitive_words = ["违法", "暴力", "色情", "赌博", "毒品"]
    for word in sensitive_words:
        if word in content:
            return False, "输入内容包含违规信息，请修改后重试"
    return True, "合规"
