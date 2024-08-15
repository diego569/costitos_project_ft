<template>
    <div class="w-full">
        <div class="border-muted-200 hover:shadow-muted-300/30 dark:hover:shadow-muted-900/20 group/card relative w-full overflow-hidden rounded-lg border bg-white transition-all duration-300 hover:shadow-xl">
            <div class=" ">
                <div class="bg-primary-100 dark:bg-muted-900/70 relative flex items-center justify-center rounded-lg">
                    <!-- <img :src="product.photo" alt="" loading="lazy" width="800" decoding="async" data-nimg="1" class="w-full transition-transform duration-200" style="color: transparent" /> -->
                    <slot name="photo" />
                    <div class="absolute start-3 top-3">
                        <span
                            class="border-muted-200 dark:border-muted-700 dark:bg-muted-800 text-muted-500 dark:text-muted-100 relative inline-flex h-7 items-center justify-center gap-1 whitespace-nowrap rounded-full border bg-white px-3 text-center font-sans text-xs leading-10 transition-all duration-300"
                            >metro</span
                        >
                    </div>
                </div>
            </div>
            <div class="h-32 p-4">
                <p class="text-md font-medium tracking-wide text-gray-700"><slot name="name" /></p>
                <p class="text-muted-400 line-clamp-3 overflow-hidden text-xs"><slot name="description" /></p>
            </div>

            <div class="border-muted-200 border-t px-4 py-3">
                <div class="flex items-center gap-2 pt-1">
                    <slot name="action" />
                </div>
            </div>
        </div>
    </div>
</template>
