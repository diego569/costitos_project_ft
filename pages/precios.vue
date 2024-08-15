<template>
    <section class="bg-primary-50">
        <div class="mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16">
            <div class="mx-auto mb-8 max-w-screen-md text-center lg:mb-12">
                <h2 class="mb-4 text-4xl font-extrabold tracking-tight text-gray-900">Comprar creditos</h2>
                <p class="mb-5 font-light text-gray-500 sm:text-xl">Compra creditos para realizar cotizaciones por medio de Yape.</p>
            </div>
            <div class="space-y-8 sm:gap-6 lg:grid lg:grid-cols-3 lg:space-y-0 xl:gap-10">
                <div v-for="(plan, index) in plans" :key="index" class="mx-auto flex max-w-lg flex-col items-center rounded-lg border border-gray-100 bg-white p-6 text-center text-gray-900 xl:p-8">
                    <div class="h-full rounded-md bg-[#EAEAEA]/50 p-4">
                        <h3 class="sr-only mb-4 text-2xl font-semibold">{{ plan.name }}</h3>
                        <Icon name="my-icon:pricing-quote" size="100" />
                        <p class="my-3 font-light text-primary-600">{{ plan.description }}</p>
                    </div>

                    <div class="my-2 flex items-baseline justify-center">
                        <span class="mr-2 font-extrabold">S/. {{ plan.price }}</span>
                        <span v-if="plan.name === 'Mensual'" class="text-gray-500">/mes</span>
                    </div>
                    <a href="#" class="w-full rounded-lg bg-primary-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-700 focus:ring-4 focus:ring-primary-200">Adquirir</a>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
    const plans = [
        {name: "Básico", description: "3 cotizaciones", price: 5},
        {name: "Normal", description: "10 cotizaciones", price: 15},
        {name: "Mensual", description: "Cotizaciones ilimitadas", price: 50},
    ];
</script>
