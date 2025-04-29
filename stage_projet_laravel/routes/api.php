<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EquipeController;
use App\Http\Controllers\EmployeeController;

Route::post('register', [AuthController::class, 'register']);
// Autres routes API...

// Route pour la connexion
Route::post('login', [AuthController::class, 'login']);

// Protéger certaines routes avec un rôle spécifique (par exemple, Admin)
Route::middleware(['auth:sanctum', 'role:administrateur'])->group(function () {
    Route::get('admin/dashboard', [AdminController::class, 'dashboard']);
});

Route::middleware('auth:sanctum')->post('logout', [AuthController::class, 'logout']);
Route::get('test', function () {
    return response()->json(['message' => 'API OK']);
});

//gestion users
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/users', [UserController::class, 'index']); // Lister tous les utilisateurs
    Route::post('/users', [UserController::class, 'store']); // Créer un nouvel utilisateur
    Route::get('/users/{user}', [UserController::class, 'show']); // Récupérer un utilisateur spécifique
    Route::put('/users/{user}', [UserController::class, 'update']); // Mettre à jour un utilisateur
    Route::delete('/users/{user}', [UserController::class, 'destroy']); // Supprimer un utilisateur
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/equipes', [EquipeController::class, 'index']);
    Route::post('/equipes', [EquipeController::class, 'store']);
    Route::get('/equipes/{id}', [EquipeController::class, 'show']);
    Route::put('/equipes/{id}', [EquipeController::class, 'update']);
    Route::delete('/equipes/{id}', [EquipeController::class, 'destroy']);
    Route::post('/equipes/{id}/add-users', [EquipeController::class, 'addUsers']);
});

// Employee Management Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::get('/employees/{id}', [EmployeeController::class, 'show']);
    Route::put('/employees/{id}', [EmployeeController::class, 'update']);
    Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
    Route::post('/employees/{id}/upload-image', [EmployeeController::class, 'uploadImage']);
    // Special routes go after ID-specific routes
    Route::post('/employees-assign-project', [EmployeeController::class, 'assignToProject']);
    Route::post('/employees-remove-project', [EmployeeController::class, 'removeFromProject']);
});
