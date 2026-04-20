from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_protect
from core.services.content_check import check_user_input
from core.services.ai_service import generate_pua_shield_content

def index(request):
    return render(request, 'index.html')

@require_http_methods(["POST"])
@csrf_protect
def generate_content(request):
    try:
        scene = request.POST.get("scene", "").strip()
        user_input = request.POST.get("user_input", "").strip()

        valid_scenes = ["职场PUA", "亲戚催婚", "甲方刁难", "朋友攀比"]
        if scene not in valid_scenes:
            return JsonResponse({"code": 400, "msg": "请选择有效的场景"}, status=400)

        is_valid, msg = check_user_input(user_input)
        if not is_valid:
            return JsonResponse({"code": 400, "msg": msg}, status=400)

        result = generate_pua_shield_content(scene, user_input)
        if "error" in result:
            return JsonResponse({"code": 500, "msg": result["error"]}, status=500)

        return JsonResponse({"code": 200, "data": result, "msg": "生成成功"})

    except Exception as e:
        return JsonResponse({"code": 500, "msg": f"系统异常：{str(e)}"}, status=500)
