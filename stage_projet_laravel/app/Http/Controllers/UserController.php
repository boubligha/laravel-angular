<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
class UserController extends Controller
{
     // Méthode pour lister tous les utilisateurs
     public function index()
     {
         // Retourner tous les utilisateurs, sauf le mot de passe
         $users = User::select('id', 'name', 'email', 'role')->get();
         return response()->json($users);
     }
 
     // Méthode pour créer un nouvel utilisateur
     public function store(Request $request)
     {
         // Validation des données
         $validator = Validator::make($request->all(), [
             'name' => 'required|string|max:255',
             'email' => 'required|string|email|max:255|unique:users',
             'password' => 'required|string|min:8',
             'role' => 'required|string|in:stagiaire,collaborateur,administrateur',
         ]);
 
         if ($validator->fails()) {
             return response()->json(['errors' => $validator->errors()], 422);
         }
 
         // Création de l'utilisateur
         $user = User::create([
             'name' => $request->name,
             'email' => $request->email,
             'password' => bcrypt($request->password),
             'role' => $request->role,
         ]);
 
         return response()->json(['message' => 'Utilisateur créé avec succès', 'user' => $user], 201);
     }
 
     // Méthode pour afficher un utilisateur spécifique
     public function show(User $user)
     {
         return response()->json($user);
     }
 
     // Méthode pour mettre à jour un utilisateur
     public function update(Request $request, User $user)
     {
         // Validation des données
         $validator = Validator::make($request->all(), [
             'name' => 'required|string|max:255',
             'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
             'role' => 'required|string|in:stagiaire,collaborateur,administrateur',
         ]);
 
         if ($validator->fails()) {
             return response()->json(['errors' => $validator->errors()], 422);
         }
 
         // Mise à jour des données
         $user->update($request->only(['name', 'email', 'role']));
 
         // Si un mot de passe est fourni, on le met à jour aussi
         if ($request->has('password')) {
             $user->password = bcrypt($request->password);
             $user->save();
         }
 
         return response()->json(['message' => 'Utilisateur mis à jour avec succès', 'user' => $user]);
     }
 
     // Méthode pour supprimer un utilisateur
     public function destroy(User $user)
     {
         $user->delete();
         return response()->json(['message' => 'Utilisateur supprimé avec succès']);
     }
    }