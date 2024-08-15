<template>
    <body class="bg-gray-100">
        <header class="bg-white shadow">
            <div class="container mx-auto flex items-center justify-between px-6 py-4">
                <div class="text-2xl font-bold text-orange-600">CostitosYa</div>
                <nav class="flex space-x-4">
                    <a href="#" class="text-gray-700 hover:text-orange-600">Catálogo</a>
                    <a href="#" class="text-gray-700 hover:text-orange-600">Proveedores</a>
                </nav>
                <div>
                    <img src="user-avatar.png" alt="User Avatar" class="h-10 w-10 rounded-full" />
                </div>
            </div>
        </header>
        <main class="container mx-auto px-6 py-8">
            <div class="rounded-lg bg-white p-6 shadow">
                <h2 class="mb-4 text-xl font-bold">Cotizar</h2>
                <div class="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <!-- Supplier 001 -->
                    <div>
                        <div class="mb-2 flex items-center">
                            <img src="supplier-logo-001.png" alt="Supplier 001" class="mr-2 h-10 w-10" />
                            <div>
                                <p class="font-bold">Supplier name 001</p>
                                <p class="text-gray-600">RUC: 208020978</p>
                                <p class="text-gray-600">JR. PIEROLAN Nº549-JULIACA</p>
                                <p class="text-green-500">917249909</p>
                            </div>
                        </div>
                    </div>
                    <!-- Supplier 002 -->
                    <div>
                        <div class="mb-2 flex items-center">
                            <img src="supplier-logo-002.png" alt="Supplier 002" class="mr-2 h-10 w-10" />
                            <div>
                                <p class="font-bold">Supplier name 002</p>
                                <p class="text-gray-600">RUC: 10769268753</p>
                                <p class="text-gray-600">AV. SOL 1178-PUNO</p>
                                <p class="text-green-500">930165583</p>
                            </div>
                        </div>
                    </div>
                    <!-- Supplier 003 -->
                    <div>
                        <div class="mb-2 flex items-center">
                            <img src="supplier-logo-003.png" alt="Supplier 003" class="mr-2 h-10 w-10" />
                            <div>
                                <p class="font-bold">Supplier name 003</p>
                                <p class="text-gray-600">RUC: 10414452227</p>
                                <p class="text-gray-600">JR MANUEL PRADO Nº 400-JULIACA</p>
                                <p class="text-green-500">950704264</p>
                            </div>
                        </div>
                    </div>
                </div>
                <table class="min-w-full bg-white">
                    <thead>
                        <tr>
                            <th class="py-2">Descripción</th>
                            <th class="py-2">Unidad</th>
                            <th class="py-2">Cantidad</th>
                            <th class="py-2">P.U. (Supplier 001)</th>
                            <th class="py-2">P.U. (Supplier 002)</th>
                            <th class="py-2">P.U. (Supplier 003)</th>
                            <th class="py-2">P. menor</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border px-4 py-2">Producto name 001</td>
                            <td class="border px-4 py-2">unid.</td>
                            <td class="border px-4 py-2">002</td>
                            <td class="border px-4 py-2">S/ 300.00</td>
                            <td class="border px-4 py-2">S/ 330.00</td>
                            <td class="border px-4 py-2">S/ 300.00</td>
                            <td class="border px-4 py-2">S/ 300.00</td>
                        </tr>
                        <tr>
                            <td class="border px-4 py-2">Producto name 001</td>
                            <td class="border px-4 py-2">unid.</td>
                            <td class="border px-4 py-2">002</td>
                            <td class="border px-4 py-2">S/ 300.00</td>
                            <td class="border px-4 py-2">S/ 330.00</td>
                            <td class="border px-4 py-2">S/ 300.00</td>
                            <td class="border px-4 py-2">S/ 300.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    </body>
</template>
