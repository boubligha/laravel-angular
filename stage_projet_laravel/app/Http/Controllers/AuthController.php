<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use App\Models\Administrateur;
use App\Models\Stagiaire;
use App\Models\Collaborateur;

class AuthController extends Controller
{
      // Méthode d'enregistrement (register)
      public function register(Request $request)
      {
          // Validation des données envoyées par l'utilisateur
          $validator = Validator::make($request->all(), [
              'name' => 'required|string|max:255',
              'email' => 'required|string|email|max:255|unique:users',
              'password' => 'required|string|confirmed|min:8',
              'role' => 'required|string|in:stagiaire,collaborateur,administrateur', // Validation du rôle
          ]);
      
          if ($validator->fails()) {
              return response()->json(['errors' => $validator->errors()], 422);
          }
      
          try {
              // Création de l'utilisateur dans la table 'users'
              $user = User::create([
                  'name' => $request->name,
                  'email' => $request->email,
                  'password' => Hash::make($request->password),
                  'role' => $request->role,
              ]);
      
              // Ajout dans la table spécifique en fonction du rôle
              if ($user->role == 'administrateur') {
                  Administrateur::create([
                      'user_id' => $user->id,
                      'name' => $user->name,
                      'email' => $user->email,
                  ]);
              }
              if ($user->role == 'stagiaire') {
                Stagiaire::create([
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'date_debut' => now(),  // Vous pouvez définir la date de début à la date actuelle ou depuis le formulaire.
                    'date_fin' => now()->addMonths(6),  // Exemple : Ajouter 6 mois à la date actuelle.
                    'formation' => 'Formation par défaut',  // Vous pouvez aussi passer un champ de formation si nécessaire.
                ]);
            }
      
              if ($user->role == 'collaborateur') {
                  Collaborateur::create([
                      'user_id' => $user->id,
                      'name' => $user->name,
                      'email' => $user->email,
                  ]);
              }
      
              // Retourner un message de succès avec le token
              return response()->json([
                  'message' => 'User registered successfully',
                  'user' => $user,
                  'token' => $user->createToken('API Token')->plainTextToken,
              ]);
          } catch (\Exception $e) {
              return response()->json(['error' => 'Error occurred: ' . $e->getMessage()], 500);
          }
      }
      
  
      // Méthode de connexion (login)
      public function login(Request $request)
      {
          // Validation des données envoyées par l'utilisateur
          $request->validate([
              'email' => 'required|string|email',
              'password' => 'required|string',
          ]);
  
          // Tentative de connexion
          if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
              $user = Auth::user();  // Récupérer l'utilisateur connecté
              return response()->json([
                  'message' => 'User logged in successfully',
                  'user' => $user,
                  'token' => $user->createToken('API Token')->plainTextToken,  // Retourner un token API
              ]);
          }
  
          return response()->json(['message' => 'Invalid credentials'], 401);  // Si les identifiants sont incorrects
      }
      public function logout(Request $request)
{
    $request->user()->currentAccessToken()->delete();
    
    return response()->json(['message' => 'Déconnecté avec succès']);
}
}
