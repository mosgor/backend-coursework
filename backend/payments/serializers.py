from rest_framework import serializers

class PayRequestSerializer(serializers.Serializer):
    eventIds = serializers.ListField(child=serializers.IntegerField(), allow_empty=False)