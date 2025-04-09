if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/home/user/.gradle/caches/8.12/transforms/469fdf48a786566fbb035ab1c8847732/transformed/hermes-android-0.78.1-debug/prefab/modules/libhermes/libs/android.armeabi-v7a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/home/user/.gradle/caches/8.12/transforms/469fdf48a786566fbb035ab1c8847732/transformed/hermes-android-0.78.1-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

