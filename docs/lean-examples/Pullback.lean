-- link: https://live.lean-lang.org/?url=https://ruplet.com/lean-examples/Pullback.lean
import Mathlib.CategoryTheory.Limits.Shapes.Pullback.PullbackCone

-- Open to use ≫ syntax for morphism composition.
open CategoryTheory

universe u

variable {X Y Z : Type u}

-- Unicode arrow is not `->`, it's `\-->` or `\hom`.
variable (f : X ⟶ Z) (g : Y ⟶ Z)


namespace Cospan
#check Limits.PullbackCone f g
end Cospan


-- In type theory, pullback is represented by a dependent pair.
-- Note the PLift, which is necessary due to `f x = g y` being `Prop`.
namespace _Sigma

-- First, we manually define the pullback and its morphisms.
def Pullback := Σ x : X, Σ y : Y, PLift $ f x = g y
def fst : Pullback f g ⟶ X := TypeCat.ofHom $ fun p => p.1
def snd : Pullback f g ⟶ Y := TypeCat.ofHom $ fun p => p.2.1

theorem commutes : fst f g ≫ f = snd f g ≫ g := by
  -- Take object from our definition of the pullback type.
  ext p
  -- Make use of the way we defined it.
  let h_def := p.2.2
  exact h_def.down

-- Prove that square commutes.
def cone : Limits.PullbackCone f g := Limits.PullbackCone.mk (fst f g) (snd f g) (commutes f g)

-- Prove universal property
-- That's as far as you can go, I didn't find a direct `IsPullback` in Mathlib
-- i.e. you construct the cone manually, prove that it is a cone, then prove that it is also a limit.
def isLimit : Limits.IsLimit (cone f g) := by
  apply Limits.PullbackCone.IsLimit.mk
  case lift =>
    intro s
    -- `.pt` is the apex object/type of the other cone.
    apply TypeCat.ofHom
    intro hs
    refine ⟨?fst_, ?snd_, ?eq_⟩
    case fst_ =>
      exact s.fst hs
    case snd_ =>
      exact s.snd hs
    case eq_ =>
      apply PLift.up
      exact ConcreteCategory.congr_hom (Limits.PullbackCone.condition s) hs

  case fac_left =>
    intro s
    ext hs
    rfl

  case fac_right =>
    intro s
    ext hs
    rfl

  case uniq =>
    intro cone lift hlift_fst hlift_snd
    ext w
    cases h : lift w with
    | mk x rest =>
      cases rest with
      | mk y heq =>
        have hx : x = cone.fst w := by
          simpa [fst, h] using ConcreteCategory.congr_hom hlift_fst w
        have hy : y = cone.snd w := by
          simpa [snd, h] using ConcreteCategory.congr_hom hlift_snd w
        subst hx
        subst hy
        cases heq
        exact h


-- Remark: the above will not work without PLift: `f x = g y` is of type Prop,
-- while the second component of dependent sigma type `Σ y : Y, ..`
-- must be a Type.
section
variable (x : X) (y : Y)

example : Prop := f x = g y
example : Type := PLift $ f x = g y
example : Sort 0 :=  f x = g y
example : Sort 1 := PLift $ f x = g y

-- Note that since after PLift we get data, we can *pattern-match* over
-- that wrapped proposition. As expected, this doesn't buy as pattern-matching
-- over the proof of Prop, which would contradict proof-irrelevance.
example : (h : PLift $ f x = g y) -> f x = g y
| PLift.up proof => proof
end
end _Sigma



-- We can use fully universe-polymorphic dependent pair type instead of `PLift`.
namespace Sigma'
def Pullback := Σ' x : X, Σ' y : Y, f x = g y

example : Pullback f g = ((x : X) ×' ((y : Y) ×' (f x = g y))) := rfl
example : Pullback f g = (PSigma fun x : X => PSigma fun y : Y => f x = g y) := rfl

-- Prove equivalence.
def sigmaEquivPSigma :
    _Sigma.Pullback f g ≃ Sigma'.Pullback f g where
  toFun p :=
    ⟨p.1, ⟨p.2.1, p.2.2.down⟩⟩
  invFun p :=
    ⟨p.1, ⟨p.2.1, PLift.up p.2.2⟩⟩
  left_inv p := by
    cases p with
    | mk x rest =>
      cases rest with
      | mk y h =>
        cases h
        rfl
  right_inv p := by
    cases p with
    | mk x rest =>
      cases rest
      rfl
      
end Sigma'


namespace Subtype
def Pullback := {pair : X × Y // f pair.1 = g pair.2 }

end Subtype


namespace Set
def Pullback := {⟨x, y⟩ : X × Y | f x = g y}
end Set
