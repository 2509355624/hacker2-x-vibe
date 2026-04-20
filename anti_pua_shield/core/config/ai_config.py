# -*- coding: utf-8 -*-
from typing import Dict, Any
from django.conf import settings

VOLCANO_API_KEY = settings.DOUBAO_API_KEY


class AIConfig:
    MODEL_MAPPING = {
        'hs-deepseek-r1': {
            'model': 'deepseek-r1-250528',
            'base_url': 'https://ark.cn-beijing.volces.com/api/v3',
            'api_key': VOLCANO_API_KEY
        }
    }

    MODEL_PARAMETERS = {
        'temperature': 0
    }

    @classmethod
    def get_model_config(cls, model_name: str = 'hs-deepseek-r1') -> Dict[str, Any]:
        config = cls.MODEL_MAPPING[model_name].copy()
        return config

    @classmethod
    def get_model_parameters(cls) -> Dict[str, Any]:
        return cls.MODEL_PARAMETERS.copy()
